import { useRef, useState } from "react";
import { Alert, Modal, ScrollView, StyleSheet, Text, View } from "react-native";
import ViewShot, { type ViewShotRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { calculateRecord, type BillingRecord } from "@landlord/core";
import { useTranslation } from "react-i18next";
import { ActionButton } from "./ActionButton";
import { colors } from "../theme";

interface Props {
  visible: boolean;
  unitName: string;
  record: BillingRecord | null;
  onClose: () => void;
}

export function SummaryModal({ visible, unitName, record, onClose }: Props) {
  const { t, i18n } = useTranslation();
  const shot = useRef<ViewShotRef>(null);
  const [sharing, setSharing] = useState(false);
  if (!record) return null;
  const computed = calculateRecord(record);

  const share = async () => {
    try {
      setSharing(true);
      const uri = await shot.current?.capture?.();
      if (!uri || !(await Sharing.isAvailableAsync())) throw new Error("Sharing unavailable");
      await Sharing.shareAsync(uri, { mimeType: "image/png", dialogTitle: t("recordRow.shareImage") });
    } catch {
      Alert.alert(t("common.error"), t("recordRow.shareError"));
    } finally {
      setSharing(false);
    }
  };

  const line = (label: string, value: string, strong = false) => (
    <View style={styles.line}>
      <Text style={styles.lineLabel}>{label}</Text>
      <Text style={[styles.lineValue, strong && styles.strong]}>{value}</Text>
    </View>
  );

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.center}>
          <ViewShot ref={shot} options={{ format: "png", quality: 1 }}>
            <View style={styles.summary} collapsable={false}>
              <Text style={styles.unit}>{unitName}</Text>
              {line(t("recordTable.startDate"), record.startDate)}
              {line(t("recordTable.endDate"), record.endDate)}
              <Text style={[styles.heading, { color: colors.blue }]}>{t("recordTable.waterMeter")}</Text>
              {line(t("recordRow.meterUsage"), `${computed.waterUsage} m³`)}
              {line(t("recordTable.waterPrice"), `¥${record.waterUnitPrice}/m³`)}
              {line(t("recordTable.waterFee"), `¥${computed.waterFeeTotal.toFixed(2)}`, true)}
              <Text style={[styles.heading, { color: colors.orange }]}>{t("recordTable.electricMeter")}</Text>
              {line(t("recordRow.meterUsage"), `${computed.electricUsage} kWh`)}
              {line(t("recordTable.electricPrice"), `¥${record.electricUnitPrice}/kWh`)}
              {line(t("recordTable.electricFee"), `¥${computed.electricFeeTotal.toFixed(2)}`, true)}
              {line(t("recordTable.extraFee"), `¥${record.extraFee.toFixed(2)}`)}
              <View style={styles.total}>
                <Text style={styles.totalLabel}>{t("recordTable.total")}</Text>
                <Text style={styles.totalValue}>¥{computed.allFeeTotal.toFixed(2)}</Text>
              </View>
              <Text style={styles.generated}>{t("recordImage.generatedOn", { date: new Date().toLocaleDateString(i18n.language === "zh" ? "zh-CN" : "en-US") })}</Text>
            </View>
          </ViewShot>
        </ScrollView>
        <View style={styles.actions}>
          <ActionButton label={t("common.close")} onPress={onClose} style={styles.action} />
          <ActionButton label={sharing ? t("common.loading") : t("recordRow.shareImage")} tone="primary" onPress={() => void share()} style={styles.action} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background, paddingTop: 30 },
  center: { padding: 18, justifyContent: "center" },
  summary: { width: 360, maxWidth: "100%", alignSelf: "center", padding: 22, backgroundColor: "white", borderRadius: 18 },
  unit: { fontSize: 26, fontWeight: "900", color: colors.text, marginBottom: 12 },
  heading: { fontSize: 18, fontWeight: "900", marginTop: 14, marginBottom: 5 },
  line: { flexDirection: "row", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: "#eef1ef", paddingVertical: 8, gap: 12 },
  lineLabel: { color: colors.muted, flex: 1 },
  lineValue: { color: colors.text, fontWeight: "700" },
  strong: { fontSize: 17 },
  total: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.primarySoft, borderRadius: 12, padding: 14, marginTop: 16 },
  totalLabel: { color: colors.text, fontSize: 19, fontWeight: "900" },
  totalValue: { color: colors.total, fontSize: 24, fontWeight: "900" },
  generated: { color: "#8d9991", textAlign: "center", fontSize: 11, marginTop: 12 },
  actions: { flexDirection: "row", gap: 10, padding: 18, paddingBottom: 24, backgroundColor: colors.surface },
  action: { flex: 1 },
});
