export interface BillingRecord {
  id: string;
  startDate: string;
  endDate: string;
  waterMeterStart: number;
  waterMeterEnd: number;
  waterUnitPrice: number;
  electricMeterStart: number;
  electricMeterEnd: number;
  electricUnitPrice: number;
  extraFee: number;
}

// Preserve the public JSON/type name used by the existing web app.
export type Record = BillingRecord;

export interface Unit {
  id: string;
  name: string;
  records: BillingRecord[];
}

export type DatePeriod = "monthly" | "fortnightly" | "weekly";

export interface Settings {
  defaultWaterUnitPrice: number;
  defaultElectricUnitPrice: number;
  defaultExtraFee: number;
  defaultDatePeriod: DatePeriod;
}

export interface AppData {
  units: Unit[];
  settings: Settings;
}

export interface ComputedValues {
  waterUsage: number;
  electricUsage: number;
  waterFeeTotal: number;
  electricFeeTotal: number;
  allFeeTotal: number;
}

