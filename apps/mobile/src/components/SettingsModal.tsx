import { useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import { type DatePeriod, type Settings } from "@landlord/core";
import { useTranslation } from "react-i18next";
import { ActionButton } from "./ActionButton";
import { LabeledNumberInput } from "./LabeledNumberInput";
import { colors } from "../theme";

interface Props {
  visible: boolean;
  settings: Settings;
  onSave: (settings: Settings) => void;
  onClose: () => void;
}

export function SettingsModal({ visible, settings, onSave, onClose }: Props) {
  const { t } = useTranslation();
  const [draft, setDraft] = useState(settings);
  const periods: DatePeriod[] = ["monthly", "fortnightly", "weekly"];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text accessibilityRole="header" style={styles.title}>{t("settings.title")}</Text>
          <ScrollView contentContainerStyle={styles.form}>
            <LabeledNumberInput label={t("settings.defaultWaterUnitPrice")} value={draft.defaultWaterUnitPrice} onChange={(v) => setDraft({ ...draft, defaultWaterUnitPrice: v })} />
            <LabeledNumberInput label={t("settings.defaultElectricUnitPrice")} value={draft.defaultElectricUnitPrice} onChange={(v) => setDraft({ ...draft, defaultElectricUnitPrice: v })} />
            <LabeledNumberInput label={t("settings.defaultExtraFee")} value={draft.defaultExtraFee} onChange={(v) => setDraft({ ...draft, defaultExtraFee: v })} />
            <Text style={styles.label}>{t("settings.defaultDatePeriod")}</Text>
            <View style={styles.periods}>
              {periods.map((period) => (
                <ActionButton
                  key={period}
                  compact
                  tone={draft.defaultDatePeriod === period ? "primary" : "secondary"}
                  label={t(`settings.datePeriod.${period}`)}
                  onPress={() => setDraft({ ...draft, defaultDatePeriod: period })}
                />
              ))}
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <ActionButton label={t("common.cancel")} onPress={onClose} style={styles.action} />
            <ActionButton label={t("common.save")} tone="primary" onPress={() => onSave(draft)} style={styles.action} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  sheet: { maxHeight: "88%", backgroundColor: colors.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  title: { fontSize: 24, fontWeight: "900", color: colors.text, marginBottom: 16 },
  form: { gap: 16 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "600" },
  periods: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actions: { flexDirection: "row", gap: 10, marginTop: 20 },
  action: { flex: 1 },
});
