import { defaultSettings } from "./domain";
import type { AppData, BillingRecord, DatePeriod, Settings, Unit } from "./types";

const periods = new Set<DatePeriod>(["monthly", "fortnightly", "weekly"]);
const isObject = (value: unknown): value is globalThis.Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function parseRecord(value: unknown): BillingRecord {
  if (!isObject(value)) throw new Error("Invalid record");
  const stringFields = ["id", "startDate", "endDate"] as const;
  const numberFields = [
    "waterMeterStart",
    "waterMeterEnd",
    "waterUnitPrice",
    "electricMeterStart",
    "electricMeterEnd",
    "electricUnitPrice",
    "extraFee",
  ] as const;
  for (const field of stringFields) {
    if (typeof value[field] !== "string" || value[field].length === 0) {
      throw new Error(`Invalid record ${field}`);
    }
  }
  for (const field of numberFields) {
    if (!isFiniteNumber(value[field])) throw new Error(`Invalid record ${field}`);
  }
  return value as unknown as BillingRecord;
}

function parseUnit(value: unknown): Unit {
  if (!isObject(value) || typeof value.id !== "string" || typeof value.name !== "string") {
    throw new Error("Invalid unit");
  }
  if (!Array.isArray(value.records)) throw new Error("Invalid unit records");
  return { id: value.id, name: value.name, records: value.records.map(parseRecord) };
}

function mergeSettings(value: unknown): Settings {
  if (value === undefined) return { ...defaultSettings };
  if (!isObject(value)) throw new Error("Invalid settings");
  const merged = { ...defaultSettings, ...value };
  if (
    !isFiniteNumber(merged.defaultWaterUnitPrice) ||
    !isFiniteNumber(merged.defaultElectricUnitPrice) ||
    !isFiniteNumber(merged.defaultExtraFee) ||
    !periods.has(merged.defaultDatePeriod as DatePeriod)
  ) {
    throw new Error("Invalid settings");
  }
  return merged as Settings;
}

export function parseAppData(value: unknown): AppData {
  if (!isObject(value) || !Array.isArray(value.units)) {
    throw new Error("Invalid app data");
  }
  return { units: value.units.map(parseUnit), settings: mergeSettings(value.settings) };
}

export function deserializeAppData(json: string): AppData {
  return parseAppData(JSON.parse(json) as unknown);
}

export function serializeAppData(data: AppData): string {
  return JSON.stringify(parseAppData(data), null, 2);
}

