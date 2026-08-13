import AsyncStorage from "@react-native-async-storage/async-storage";
import { initialData, parseAppData, serializeAppData, type AppData } from "@landlord/core";

export const DATA_STORAGE_KEY = "landlord:data:v1";
export const LANGUAGE_STORAGE_KEY = "landlord:language:v1";

export interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
}

export async function loadStoredData(
  storage: StorageAdapter = AsyncStorage,
): Promise<{ data: AppData; recovered: boolean }> {
  const json = await storage.getItem(DATA_STORAGE_KEY);
  if (json === null) return { data: initialData, recovered: false };
  try {
    return { data: parseAppData(JSON.parse(json) as unknown), recovered: false };
  } catch {
    return { data: initialData, recovered: true };
  }
}

export async function saveStoredData(
  data: AppData,
  storage: StorageAdapter = AsyncStorage,
): Promise<void> {
  await storage.setItem(DATA_STORAGE_KEY, serializeAppData(data));
}

export async function loadStoredLanguage(
  storage: StorageAdapter = AsyncStorage,
): Promise<"en" | "zh"> {
  return (await storage.getItem(LANGUAGE_STORAGE_KEY)) === "zh" ? "zh" : "en";
}

export async function saveStoredLanguage(
  language: "en" | "zh",
  storage: StorageAdapter = AsyncStorage,
): Promise<void> {
  await storage.setItem(LANGUAGE_STORAGE_KEY, language);
}

