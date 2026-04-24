import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { figma } from '../../theme/figma';
import { dashboardStrings } from '../../locales/dashboard.strings';
import type { AppLanguage } from '../../locales/dashboard.strings';

/** Figma “Quick send” avatars and names (same as reference) */
const PEOPLE: Array<{
  id: string;
  name: string;
  uri: string;
}> = [
  {
    id: 'kfc',
    name: 'Tamjid',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 'yandex',
    name: 'Jennifer',
    uri: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 'zovq',
    name: 'Faysal',
    uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=faces'
  },
  {
    id: 'utility',
    name: 'Mostafa',
    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&crop=faces'
  }
];

type WalletQuickSendChipsProps = {
  appLanguage: AppLanguage;
  onPick: (id: string) => void;
};

export function WalletQuickSendChips({ appLanguage, onPick }: WalletQuickSendChipsProps) {
  const t = dashboardStrings(appLanguage);
  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.title}>{t.quickSend}</Text>
        <Text style={styles.seeAll}>{t.seeAll}</Text>
      </View>
      <View style={styles.row}>
        {PEOPLE.map((p) => (
          <Pressable
            accessibilityRole="button"
            key={p.id}
            onPress={() => onPick(p.id)}
            style={({ pressed }) => [styles.cell, pressed && { opacity: 0.9 }]}
          >
            <Image
              source={{ uri: p.uri }}
              style={styles.avatar}
            />
            <Text numberOfLines={1} style={styles.name}>
              {p.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: figma.type.section, fontWeight: '800', color: figma.color.text },
  seeAll: { color: figma.color.textLabel, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  cell: { alignItems: 'center', width: '22%' },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    borderWidth: 2,
    borderColor: figma.color.glassStroke,
    backgroundColor: figma.color.bgAlt
  },
  name: {
    fontSize: figma.type.caption,
    fontWeight: '600',
    color: figma.color.textMuted,
    marginTop: 6,
    textAlign: 'center'
  }
});
