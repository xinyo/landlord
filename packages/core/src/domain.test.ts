import { describe, expect, it } from "vitest";
import {
  calculateRecord,
  createNextRecord,
  defaultSettings,
  deserializeAppData,
  inferPeriodFromRecord,
  parseAppData,
  serializeAppData,
  type BillingRecord,
} from ".";

const record: BillingRecord = {
  id: "record-1",
  startDate: "2026-01-01",
  endDate: "2026-01-31",
  waterMeterStart: 100,
  waterMeterEnd: 112,
  waterUnitPrice: 3.5,
  electricMeterStart: 200,
  electricMeterEnd: 225,
  electricUnitPrice: 0.6,
  extraFee: 10,
};

describe("billing domain", () => {
  it("calculates usage and rounded totals", () => {
    expect(calculateRecord(record)).toEqual({
      waterUsage: 12,
      electricUsage: 25,
      waterFeeTotal: 42,
      electricFeeTotal: 15,
      allFeeTotal: 67,
    });
  });

  it("clamps meter regression to zero", () => {
    expect(calculateRecord({ ...record, waterMeterEnd: 50 }).waterUsage).toBe(0);
  });

  it("carries values forward into the next matching billing period", () => {
    const next = createNextRecord([record], defaultSettings, "record-2");
    expect(next).toMatchObject({
      id: "record-2",
      startDate: "2026-02-01",
      endDate: "2026-02-28",
      waterMeterStart: 112,
      electricMeterStart: 225,
      waterUnitPrice: 3.5,
      electricUnitPrice: 0.6,
      extraFee: 10,
    });
  });

  it("supports weekly and fortnightly period inference", () => {
    expect(inferPeriodFromRecord({ ...record, startDate: "2026-01-01", endDate: "2026-01-07" }, "monthly")).toBe("weekly");
    expect(inferPeriodFromRecord({ ...record, startDate: "2026-01-01", endDate: "2026-01-14" }, "monthly")).toBe("fortnightly");
  });
});

describe("AppData compatibility", () => {
  it("merges defaults into backups without settings", () => {
    expect(parseAppData({ units: [] }).settings).toEqual(defaultSettings);
  });

  it("round-trips the existing JSON wire shape", () => {
    const data = { units: [{ id: "unit-1", name: "Flat", records: [record] }], settings: defaultSettings };
    expect(deserializeAppData(serializeAppData(data))).toEqual(data);
  });

  it("rejects malformed records", () => {
    expect(() => parseAppData({ units: [{ id: "unit-1", name: "Flat", records: [{ id: "bad" }] }] })).toThrow();
  });
});

