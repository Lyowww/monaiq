import { useMemo, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import type { AppLanguage } from '../../locales/i18n.types';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';
import { theme } from '../../theme/tokens';

export function dateToYyyyMmDd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function localeTag(lang: AppLanguage): string {
  return lang === 'hy' ? 'hy-AM' : 'en-US';
}

function defaultBirthDate(): Date {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setFullYear(d.getFullYear() - 18);
  return d;
}

export { defaultBirthDate };

type AuthDateFieldProps = {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  appLanguage: AppLanguage;
  closeLabel: string;
};

export function AuthDateField({ label, value, onChange, appLanguage, closeLabel }: AuthDateFieldProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { minimumDate, maximumDate } = useMemo(() => {
    const max = new Date();
    max.setHours(23, 59, 59, 999);
    max.setFullYear(max.getFullYear() - 12);
    const min = new Date();
    min.setFullYear(min.getFullYear() - 120);
    min.setHours(0, 0, 0, 0);
    return { minimumDate: min, maximumDate: max };
  }, []);

  const display = value.toLocaleDateString(localeTag(appLanguage), {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  const open = (): void => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value,
        mode: 'date',
        minimumDate,
        maximumDate,
        onChange: (event, date) => {
          if (event.type === 'set' && date) {
            onChange(date);
          }
        }
      });
    } else {
      setSheetOpen(true);
    }
  };

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        onPress={open}
        style={({ pressed }) => [styles.inputRow, pressed && { opacity: 0.88 }]}
      >
        <Text style={styles.valueText}>{display}</Text>
        <Ionicons color={figma.color.textMuted} name="calendar-outline" size={22} style={styles.icon} />
      </Pressable>
      {Platform.OS !== 'android' ? (
        <Modal
          animationType="slide"
          onRequestClose={() => setSheetOpen(false)}
          transparent
          visible={sheetOpen}
        >
          <View style={styles.modalRoot}>
            <Pressable
              accessibilityRole="button"
              onPress={() => setSheetOpen(false)}
              style={styles.modalBackdrop}
            />
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Pressable
                  accessibilityRole="button"
                  hitSlop={12}
                  onPress={() => setSheetOpen(false)}
                  style={styles.sheetDoneHit}
                >
                  <Text style={styles.sheetDone}>{closeLabel}</Text>
                </Pressable>
              </View>
              <DateTimePicker
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                maximumDate={maximumDate}
                minimumDate={minimumDate}
                mode="date"
                onChange={(_, date) => {
                  if (date) {
                    onChange(date);
                  }
                }}
                themeVariant="light"
                value={value}
              />
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    marginBottom: theme.spacing.md
  },
  label: {
    color: figma.color.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: 0.2
  },
  inputRow: {
    alignItems: 'center',
    backgroundColor: 'rgba(168, 182, 160, 0.12)',
    borderColor: figma.color.divider,
    borderRadius: figma.radius.activityRow,
    borderWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 52,
    paddingHorizontal: 16
  },
  valueText: {
    color: figma.color.text,
    flex: 1,
    fontSize: 16,
    paddingVertical: 12
  },
  icon: {
    marginLeft: 8
  },
  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)'
  },
  sheet: {
    backgroundColor: '#F5F5F2',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
    paddingBottom: 28
  },
  sheetHeader: {
    alignItems: 'flex-end',
    borderBottomColor: figma.color.divider,
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 16,
    paddingVertical: 12
  },
  sheetDoneHit: {
    paddingVertical: 4
  },
  sheetDone: {
    color: figma.color.primary,
    fontSize: 17,
    fontWeight: '600'
  }
});
