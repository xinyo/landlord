import type {
  AppData,
  BillingRecord,
  ComputedValues,
  DatePeriod,
  Settings,
} from "./types";

export const defaultSettings: Settings = {
  defaultWaterUnitPrice: 3.5,
  defaultElectricUnitPrice: 0.6,
  defaultExtraFee: 10,
  defaultDatePeriod: "monthly",
};

export const initialData: AppData = {
  units: [],
  settings: defaultSettings,
};

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

export function calculateRecord(record: BillingRecord): ComputedValues {
  const waterUsage = Math.max(0, record.waterMeterEnd - record.waterMeterStart);
  const electricUsage = Math.max(0, record.electricMeterEnd - record.electricMeterStart);
  const waterFeeTotal = roundCurrency(waterUsage * record.waterUnitPrice);
  const electricFeeTotal = roundCurrency(electricUsage * record.electricUnitPrice);

  return {
    waterUsage,
    electricUsage,
    waterFeeTotal,
    electricFeeTotal,
    allFeeTotal: roundCurrency(waterFeeTotal + electricFeeTotal + record.extraFee),
  };
}

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function getPeriodEndDate(startDate: Date, period: DatePeriod): Date {
  if (period === "weekly") return addDays(startDate, 6);
  if (period === "fortnightly") return addDays(startDate, 13);
  return addDays(addMonths(startDate, 1), -1);
}

export function inferPeriodFromRecord(
  record: BillingRecord,
  fallback: DatePeriod,
): DatePeriod {
  const startDate = parseDate(record.startDate);
  const endDate = parseDate(record.endDate);
  const durationInDays =
    Math.round((endDate.getTime() - startDate.getTime()) / 86_400_000) + 1;

  if (durationInDays === 7) return "weekly";
  if (durationInDays === 14) return "fortnightly";
  if (formatDate(endDate) === formatDate(addDays(addMonths(startDate, 1), -1))) {
    return "monthly";
  }
  return fallback;
}

export function createNextRecord(
  records: BillingRecord[],
  settings: Settings,
  id: string,
  today = new Date(),
): BillingRecord {
  let startDate: Date;
  let endDate: Date;
  let waterUnitPrice = settings.defaultWaterUnitPrice;
  let electricUnitPrice = settings.defaultElectricUnitPrice;
  let extraFee = settings.defaultExtraFee;
  let waterMeterStart = 0;
  let electricMeterStart = 0;

  if (records.length > 0) {
    const previous = records[records.length - 1];
    const period = inferPeriodFromRecord(previous, settings.defaultDatePeriod);
    startDate = addDays(parseDate(previous.endDate), 1);
    endDate = getPeriodEndDate(startDate, period);
    waterUnitPrice = previous.waterUnitPrice;
    electricUnitPrice = previous.electricUnitPrice;
    extraFee = previous.extraFee;
    waterMeterStart = previous.waterMeterEnd;
    electricMeterStart = previous.electricMeterEnd;
  } else if (settings.defaultDatePeriod === "monthly") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  } else {
    startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    endDate = getPeriodEndDate(startDate, settings.defaultDatePeriod);
  }

  return {
    id,
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    waterMeterStart,
    waterMeterEnd: 0,
    waterUnitPrice,
    electricMeterStart,
    electricMeterEnd: 0,
    electricUnitPrice,
    extraFee,
  };
}

