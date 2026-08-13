import { useState } from "react";
import DateTimePicker, { type DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatDate, parseDate } from "@landlord/core";
import { colors } from "../theme";

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function DateField({ label, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const handleChange = (_event: DateTimePickerEvent, date?: Date) => {
    setOpen(false);
    if (date) onChange(formatDate(date));
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={() => setOpen(true)}
        style={styles.input}
      >
        <Text style={styles.value}>{value}</Text>
      </Pressable>
      {open && (
        <DateTimePicker value={parseDate(value)} mode="date" onChange={handleChange} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, minWidth: 140 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "600", marginBottom: 5 },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  value: { color: colors.text, fontSize: 16 },
});

