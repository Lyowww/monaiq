import { StyleSheet, Text, View } from 'react-native';
import { figma } from '../../theme/figma';
import type { AppLanguage } from '../../locales/i18n.types';
import { dashboardStrings } from '../../locales/dashboard.strings';

type HomeGreetingProps = {
  firstName: string;
  appLanguage: AppLanguage;
};

export function HomeGreeting({ firstName, appLanguage }: HomeGreetingProps) {
  const t = dashboardStrings(appLanguage);
  const sub = t.welcomeBack?.trim();
  return (
    <View style={styles.wrap}>
      <Text style={styles.hello}>{t.hello(firstName || '…')}</Text>
      {sub ? <Text style={styles.welcome}>{sub}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4, marginBottom: 4 },
  hello: { fontSize: 22, fontWeight: '600', color: figma.color.text, letterSpacing: 0.2, marginTop: 8 },
  welcome: {
    fontSize: 14,
    color: figma.color.textMuted,
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2
  }
});
