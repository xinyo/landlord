import { StyleSheet, Text, View } from "react-native";
import { calculateRecord, type BillingRecord } from "@landlord/core";
import { useTranslation } from "react-i18next";
import { ActionButton } from "./ActionButton";
import { DateField } from "./DateField";
import { LabeledNumberInput } from "./LabeledNumberInput";
import { colors } from "../theme";

interface Props {
  record: BillingRecord;
  onChange: (record: BillingRecord) => void;
  onDelete: () => void;
  onPreview: () => void;
}

export function RecordEditor({ record, onChange, onDelete, onPreview }: Props) {
  const { t } = useTranslation();
  const computed = calculateRecord(record);
  const set = <K extends keyof BillingRecord>(field: K, value: BillingRecord[K]) =>
    onChange({ ...record, [field]: value });

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <DateField label={t("recordTable.startDate")} value={record.startDate} onChange={(v) => set("startDate", v)} />
        <DateField label={t("recordTable.endDate")} value={record.endDate} onChange={(v) => set("endDate", v)} />
      </View>

      <View style={[styles.section, styles.water]}>
        <Text style={[styles.sectionTitle, { color: colors.blue }]}>{t("recordTable.waterMeter")}</Text>
        <View style={styles.row}>
          <LabeledNumberInput label={t("recordRow.meterStart")} value={record.waterMeterStart} onChange={(v) => set("waterMeterStart", v)} />
          <LabeledNumberInput label={t("recordRow.meterEnd")} value={record.waterMeterEnd} onChange={(v) => set("waterMeterEnd", v)} />
          <LabeledNumberInput label={t("recordTable.waterPrice")} value={record.waterUnitPrice} onChange={(v) => set("waterUnitPrice", v)} />
        </View>
        <Text style={styles.amount}>{t("recordRow.meterUsage")}: {computed.waterUsage} m³ · ¥{computed.waterFeeTotal.toFixed(2)}</Text>
      </View>

      <View style={[styles.section, styles.electric]}>
        <Text style={[styles.sectionTitle, { color: colors.orange }]}>{t("recordTable.electricMeter")}</Text>
        <View style={styles.row}>
          <LabeledNumberInput label={t("recordRow.meterStart")} value={record.electricMeterStart} onChange={(v) => set("electricMeterStart", v)} />
          <LabeledNumberInput label={t("recordRow.meterEnd")} value={record.electricMeterEnd} onChange={(v) => set("electricMeterEnd", v)} />
          <LabeledNumberInput label={t("recordTable.electricPrice")} value={record.electricUnitPrice} onChange={(v) => set("electricUnitPrice", v)} />
        </View>
        <Text style={styles.amount}>{t("recordRow.meterUsage")}: {computed.electricUsage} kWh · ¥{computed.electricFeeTotal.toFixed(2)}</Text>
      </View>

      <LabeledNumberInput label={t("recordTable.extraFee")} value={record.extraFee} onChange={(v) => set("extraFee", v)} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>{t("recordTable.total")}</Text>
        <Text style={styles.total}>¥{computed.allFeeTotal.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <ActionButton compact label={t("recordRow.previewImage")} onPress={onPreview} />
        <ActionButton compact tone="danger" label={t("recordRow.deleteRecord")} onPress={onDelete} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 16, gap: 16, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  section: { borderRadius: 14, padding: 12, gap: 10 },
  water: { backgroundColor: colors.blueSoft },
  electric: { backgroundColor: colors.orangeSoft },
  sectionTitle: { fontSize: 16, fontWeight: "800" },
  amount: { color: colors.text, fontWeight: "700", textAlign: "right" },
  totalRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.primarySoft, borderRadius: 14, padding: 16 },
  totalLabel: { color: colors.text, fontSize: 18, fontWeight: "800" },
  total: { color: colors.total, fontSize: 24, fontWeight: "900" },
  actions: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
});
