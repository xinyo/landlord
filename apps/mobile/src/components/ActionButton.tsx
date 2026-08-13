import { Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from "react-native";
import { colors } from "../theme";

interface Props {
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
  tone?: "primary" | "secondary" | "danger";
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function ActionButton({
  label,
  onPress,
  accessibilityLabel,
  tone = "secondary",
  compact = false,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        compact && styles.compact,
        tone === "primary" && styles.primary,
        tone === "danger" && styles.danger,
        pressed && styles.pressed,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          tone === "primary" && styles.primaryLabel,
          tone === "danger" && styles.dangerLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  compact: { minHeight: 38, paddingHorizontal: 12 },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  danger: { backgroundColor: colors.dangerSoft, borderColor: "#f4c7c3" },
  label: { color: colors.text, fontSize: 14, fontWeight: "700" },
  primaryLabel: { color: "white" },
  dangerLabel: { color: colors.danger },
  pressed: { opacity: 0.7 },
});

