import { describe, expect, it } from "vitest";
import { defaultSettings } from "@landlord/core";
import {
  DATA_STORAGE_KEY,
  LANGUAGE_STORAGE_KEY,
  loadStoredData,
  loadStoredLanguage,
  saveStoredData,
  saveStoredLanguage,
  type StorageAdapter,
} from "./storage";

function memoryStorage(initial: globalThis.Record<string, string> = {}): StorageAdapter & { values: globalThis.Record<string, string> } {
  const values = { ...initial };
  return {
    values,
    async getItem(key) { return values[key] ?? null; },
    async setItem(key, value) { values[key] = value; },
  };
}

describe("mobile persistence", () => {
  it("hydrates empty storage with defaults", async () => {
    const result = await loadStoredData(memoryStorage());
    expect(result).toEqual({ data: { units: [], settings: defaultSettings }, recovered: false });
  });

  it("recovers from corrupt data without throwing", async () => {
    const result = await loadStoredData(memoryStorage({ [DATA_STORAGE_KEY]: "not-json" }));
    expect(result.recovered).toBe(true);
    expect(result.data.units).toEqual([]);
  });

  it("persists valid data and language", async () => {
    const storage = memoryStorage();
    await saveStoredData({ units: [], settings: defaultSettings }, storage);
    await saveStoredLanguage("zh", storage);
    expect(JSON.parse(storage.values[DATA_STORAGE_KEY]).settings).toEqual(defaultSettings);
    expect(storage.values[LANGUAGE_STORAGE_KEY]).toBe("zh");
    expect(await loadStoredLanguage(storage)).toBe("zh");
  });
});

