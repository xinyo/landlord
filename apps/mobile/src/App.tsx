import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Crypto from "expo-crypto";
import { useTranslation } from "react-i18next";
import {
  createNextRecord,
  initialData,
  type AppData,
  type BillingRecord,
  type Settings,
  type Unit,
} from "@landlord/core";
import "./i18n";
import { pickBackup, shareBackup } from "./backup";
import {
  loadStoredData,
  loadStoredLanguage,
  saveStoredData,
  saveStoredLanguage,
} from "./storage";
import { colors } from "./theme";
import { ActionButton } from "./components/ActionButton";
import { RecordEditor } from "./components/RecordEditor";
import { SettingsModal } from "./components/SettingsModal";
import { SummaryModal } from "./components/SummaryModal";

function LandlordApp() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState<AppData>(initialData);
  const [hydrated, setHydrated] = useState(false);
  const [newUnitName, setNewUnitName] = useState("");
  const [selectedUnitId, setSelectedUnitId] = useState("");
  const [selectedRecordIds, setSelectedRecordIds] = useState<globalThis.Record<string, string>>({});
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [previewRecord, setPreviewRecord] = useState<BillingRecord | null>(null);
  const [storageErrorShown, setStorageErrorShown] = useState(false);

  useEffect(() => {
    let active = true;
    void Promise.all([loadStoredData(), loadStoredLanguage()]).then(([stored, language]) => {
      if (!active) return;
      setData(stored.data);
      void i18n.changeLanguage(language);
      setHydrated(true);
      if (stored.recovered) Alert.alert(i18n.t("common.error"), i18n.t("storage.loadError"));
    }).catch(() => {
      if (!active) return;
      setHydrated(true);
      Alert.alert(i18n.t("common.error"), i18n.t("storage.loadError"));
    });
    return () => { active = false; };
  }, [i18n]);

  useEffect(() => {
    if (!hydrated) return;
    const timeout = setTimeout(() => {
      void saveStoredData(data).catch(() => {
        if (!storageErrorShown) {
          setStorageErrorShown(true);
          Alert.alert(t("common.error"), t("storage.saveError"));
        }
      });
    }, 150);
    return () => clearTimeout(timeout);
  }, [data, hydrated, storageErrorShown, t]);

  const selectedUnit = useMemo(() => {
    if (data.units.length === 0) return null;
    return data.units.find((unit) => unit.id === selectedUnitId) ?? data.units[0];
  }, [data.units, selectedUnitId]);

  const selectedRecord = useMemo(() => {
    if (!selectedUnit || selectedUnit.records.length === 0) return null;
    const wanted = selectedRecordIds[selectedUnit.id];
    return selectedUnit.records.find((record) => record.id === wanted) ?? selectedUnit.records[selectedUnit.records.length - 1];
  }, [selectedRecordIds, selectedUnit]);

  const replaceUnit = useCallback((unit: Unit) => {
    setData((current) => ({ ...current, units: current.units.map((item) => item.id === unit.id ? unit : item) }));
  }, []);

  const addUnit = () => {
    const name = newUnitName.trim();
    if (!name) return;
    const unit: Unit = { id: Crypto.randomUUID(), name, records: [] };
    setData((current) => ({ ...current, units: [...current.units, unit] }));
    setSelectedUnitId(unit.id);
    setNewUnitName("");
  };

  const deleteUnit = (unit: Unit) => Alert.alert(
    t("unitCard.deleteUnit"),
    t("unitCard.deleteConfirm"),
    [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: () => setData((current) => ({ ...current, units: current.units.filter((item) => item.id !== unit.id) })) },
    ],
  );

  const addRecord = () => {
    if (!selectedUnit) return;
    const record = createNextRecord(selectedUnit.records, data.settings, Crypto.randomUUID());
    replaceUnit({ ...selectedUnit, records: [...selectedUnit.records, record] });
    setSelectedRecordIds((current) => ({ ...current, [selectedUnit.id]: record.id }));
  };

  const updateRecord = (record: BillingRecord) => {
    if (!selectedUnit) return;
    replaceUnit({ ...selectedUnit, records: selectedUnit.records.map((item) => item.id === record.id ? record : item) });
  };

  const deleteRecord = (record: BillingRecord) => {
    if (!selectedUnit) return;
    Alert.alert(t("recordRow.deleteRecord"), t("recordRow.deleteConfirm"), [
      { text: t("common.cancel"), style: "cancel" },
      { text: t("common.delete"), style: "destructive", onPress: () => replaceUnit({ ...selectedUnit, records: selectedUnit.records.filter((item) => item.id !== record.id) }) },
    ]);
  };

  const toggleLanguage = () => {
    const language = i18n.language === "zh" ? "en" : "zh";
    void i18n.changeLanguage(language);
    void saveStoredLanguage(language);
  };

  const restore = async () => {
    try {
      const restored = await pickBackup();
      if (!restored) return;
      Alert.alert(t("storage.replaceTitle"), t("storage.replaceMessage"), [
        { text: t("common.cancel"), style: "cancel" },
        { text: t("common.confirm"), onPress: () => { setData(restored); setSelectedUnitId(""); setSelectedRecordIds({}); } },
      ]);
    } catch {
      Alert.alert(t("common.error"), t("toolbar.loadError"));
    }
  };

  const saveSettings = (settings: Settings) => {
    setData((current) => ({ ...current, settings }));
    setSettingsOpen(false);
  };

  if (!hydrated) {
    return <SafeAreaView style={styles.loading}><Text style={styles.muted}>{t("common.loading")}</Text></SafeAreaView>;
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}>
          <View style={styles.header}>
            <View style={styles.brand}>
              <Text accessibilityRole="header" style={styles.title}>{t("app.shortTitle")}</Text>
              <Text style={styles.subtitle}>{t("app.title")}</Text>
            </View>
            <View style={styles.toolbar}>
              <ActionButton compact label={t("toolbar.backup")} onPress={() => void shareBackup(data).catch(() => Alert.alert(t("common.error"), t("toolbar.saveError")))} />
              <ActionButton compact label={t("toolbar.restore")} onPress={() => void restore()} />
              <ActionButton compact label={i18n.language === "zh" ? t("language.en") : t("language.zh")} onPress={toggleLanguage} />
              <ActionButton compact label={t("settings.title")} onPress={() => setSettingsOpen(true)} />
            </View>
          </View>

          <View style={styles.addRow}>
            <TextInput
              accessibilityLabel={t("unitList.placeholder")}
              placeholder={t("unitList.placeholder")}
              placeholderTextColor="#8a968f"
              value={newUnitName}
              onChangeText={setNewUnitName}
              onSubmitEditing={addUnit}
              style={styles.unitInput}
            />
            <ActionButton label={t("unitList.addUnit")} tone="primary" onPress={addUnit} />
          </View>

          {data.units.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyTitle}>{t("unitList.noUnits")}</Text>
              <Text style={styles.muted}>{t("unitList.noUnitsHint")}</Text>
            </View>
          ) : (
            <>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips} accessibilityLabel={t("unitList.selectUnit")}>
                {data.units.map((unit) => (
                  <Pressable key={unit.id} accessibilityRole="button" onPress={() => setSelectedUnitId(unit.id)} style={[styles.chip, selectedUnit?.id === unit.id && styles.chipActive]}>
                    <Text style={[styles.chipText, selectedUnit?.id === unit.id && styles.chipTextActive]}>{unit.name}</Text>
                  </Pressable>
                ))}
              </ScrollView>

              {selectedUnit && (
                <View style={styles.unitSection}>
                  <View style={styles.unitHeader}>
                    <TextInput
                      accessibilityLabel={t("unitList.renameUnit")}
                      value={selectedUnit.name}
                      onChangeText={(name) => replaceUnit({ ...selectedUnit, name })}
                      style={styles.unitName}
                    />
                    <ActionButton compact tone="danger" label={t("unitCard.deleteUnit")} onPress={() => deleteUnit(selectedUnit)} />
                  </View>
                  <View style={styles.recordHeader}>
                    {selectedUnit.records.length > 0 && (
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recordChips} accessibilityLabel={t("recordTable.selectRecord")}>
                        {selectedUnit.records.map((record) => (
                          <Pressable key={record.id} accessibilityRole="button" onPress={() => setSelectedRecordIds((current) => ({ ...current, [selectedUnit.id]: record.id }))} style={[styles.recordChip, selectedRecord?.id === record.id && styles.recordChipActive]}>
                            <Text style={[styles.recordChipText, selectedRecord?.id === record.id && styles.recordChipTextActive]}>{record.startDate} → {record.endDate}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    )}
                    <ActionButton compact tone="primary" label={t("recordTable.addRecord")} onPress={addRecord} />
                  </View>
                  {selectedRecord ? (
                    <RecordEditor record={selectedRecord} onChange={updateRecord} onDelete={() => deleteRecord(selectedRecord)} onPreview={() => setPreviewRecord(selectedRecord)} />
                  ) : (
                    <View style={styles.empty}><Text style={styles.muted}>{t("recordTable.noRecords")}</Text></View>
                  )}
                </View>
              )}
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {settingsOpen && <SettingsModal visible settings={data.settings} onSave={saveSettings} onClose={() => setSettingsOpen(false)} />}
      <SummaryModal visible={previewRecord !== null} unitName={selectedUnit?.name ?? ""} record={previewRecord} onClose={() => setPreviewRecord(null)} />
    </SafeAreaView>
  );
}

export default function App() {
  return <SafeAreaProvider><LandlordApp /></SafeAreaProvider>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  loading: { flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" },
  page: { padding: 16, paddingBottom: 48, gap: 18, width: "100%", maxWidth: 820, alignSelf: "center" },
  header: { gap: 14 },
  brand: { gap: 2 },
  title: { color: colors.primary, fontSize: 30, fontWeight: "900" },
  subtitle: { color: colors.muted, fontSize: 14 },
  toolbar: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  addRow: { flexDirection: "row", gap: 10 },
  unitInput: { flex: 1, minHeight: 48, backgroundColor: colors.surface, color: colors.text, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 14, fontSize: 16 },
  empty: { alignItems: "center", justifyContent: "center", padding: 28, backgroundColor: colors.surface, borderRadius: 18, borderWidth: 1, borderColor: colors.border },
  emptyTitle: { color: colors.text, fontSize: 18, fontWeight: "800", marginBottom: 4 },
  muted: { color: colors.muted },
  chips: { gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 99, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.text, fontWeight: "700" },
  chipTextActive: { color: "white" },
  unitSection: { gap: 14 },
  unitHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  unitName: { flex: 1, color: colors.text, fontSize: 23, fontWeight: "900", borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 6 },
  recordHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  recordChips: { gap: 7, flexGrow: 1 },
  recordChip: { borderRadius: 10, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 11, paddingVertical: 9 },
  recordChipActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  recordChipText: { color: colors.muted, fontSize: 12, fontWeight: "700" },
  recordChipTextActive: { color: colors.primary },
});
