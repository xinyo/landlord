import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "../theme";

interface Props {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

export function LabeledNumberInput({ label, value, onChange }: Props) {
  const [draft, setDraft] = useState(String(value));
  const [editing, setEditing] = useState(false);

  const commit = () => {
    const next = Number(draft);
    if (Number.isFinite(next)) onChange(next);
    else setDraft(String(value));
    setEditing(false);
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={editing ? draft : String(value)}
        onChangeText={setDraft}
        onFocus={() => {
          setDraft(String(value));
          setEditing(true);
        }}
        onBlur={commit}
        onSubmitEditing={commit}
        keyboardType="decimal-pad"
        selectTextOnFocus
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, minWidth: 112 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 5 },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: colors.surface,
    fontSize: 16,
  },
});
