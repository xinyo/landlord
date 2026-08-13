import * as DocumentPicker from "expo-document-picker";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { deserializeAppData, serializeAppData, type AppData } from "@landlord/core";

export async function shareBackup(data: AppData): Promise<void> {
  if (!(await Sharing.isAvailableAsync())) throw new Error("Sharing unavailable");
  const date = new Date().toISOString().slice(0, 10);
  const file = new File(Paths.cache, `landlord-data-${date}.json`);
  file.create({ overwrite: true });
  file.write(serializeAppData(data));
  await Sharing.shareAsync(file.uri, {
    dialogTitle: "Landlord data backup",
    mimeType: "application/json",
  });
}

export async function pickBackup(): Promise<AppData | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: "application/json",
    copyToCacheDirectory: true,
    multiple: false,
  });
  if (result.canceled) return null;
  const json = await new File(result.assets[0].uri).text();
  return deserializeAppData(json);
}

