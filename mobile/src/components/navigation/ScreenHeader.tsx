import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { figma } from '../../theme/figma';

type LeftAction = 'back' | 'close' | 'none';

type ScreenHeaderProps = {
  title: string;
  subtitle?: string;
  leftAction?: LeftAction;
  onLeftPress?: () => void;
  right?: ReactNode;
  reserveLeftSpace?: boolean;
};

export function ScreenHeader({
  title,
  subtitle,
  leftAction = 'none',
  onLeftPress,
  right,
  reserveLeftSpace = true
}: ScreenHeaderProps) {
  const showLeft = leftAction !== 'none' && onLeftPress;
  const icon = leftAction === 'back' ? ('chevron-back' as const) : ('close' as const);
  const side = 44;

  return (
    <View style={styles.row}>
      <View style={{ width: side, alignItems: 'flex-start' }}>
        {showLeft ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={10}
            onPress={onLeftPress}
            style={({ pressed }) => [styles.iconBtn, pressed && { opacity: 0.75 }]}
          >
            <Ionicons color={figma.color.text} name={icon} size={26} />
          </Pressable>
        ) : reserveLeftSpace ? null : null}
      </View>
      <View style={styles.titleBlock}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <View style={{ width: side, alignItems: 'flex-end' }}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
    marginBottom: 4
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: figma.color.bgElevated,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: figma.color.divider
  },
  titleBlock: { flex: 1, alignItems: 'center', paddingHorizontal: 8 },
  title: { fontSize: 17, fontWeight: '600', color: figma.color.text, textAlign: 'center', letterSpacing: 0.2 },
  subtitle: { fontSize: 12, fontWeight: '500', color: figma.color.textMuted, marginTop: 2, textAlign: 'center' }
});
