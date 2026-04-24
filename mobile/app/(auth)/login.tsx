import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { authApi } from '../../src/features/auth/api/authApi';
import { useAuthStore } from '../../src/features/auth/store/useAuthStore';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate } from '../../src/locales/i18n';
import { AuthBrandMark } from '../../src/components/auth/AuthBrandMark';
import { AuthFormSurface } from '../../src/components/auth/AuthFormSurface';
import { AuthGradientBackground } from '../../src/components/auth/AuthGradientBackground';
import { AuthPrimaryButton } from '../../src/components/auth/AuthPrimaryButton';
import { AuthTextField } from '../../src/components/auth/AuthTextField';
import { figma } from '../../src/theme/figma';

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const lang = useUiStore((s) => s.appLanguage);
  const t = (key: string, params?: Record<string, string | number>) => translate(lang, key, params);
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      const session = await authApi.login({
        email,
        password,
        deviceName: 'Expo Mobile'
      });
      await setSession(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.loginError');
      Alert.alert(t('auth.loginFailed'), message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <AuthBrandMark />
            <Text style={styles.title}>{t('auth.loginTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.loginSubtitle')}</Text>
          </View>

          <AuthFormSurface style={styles.card}>
            <AuthTextField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              label={t('auth.email')}
              onChangeText={setEmail}
              value={email}
            />
            <AuthTextField
              label={t('auth.password')}
              onChangeText={setPassword}
              secureTextEntry
              value={password}
            />
            <AuthPrimaryButton
              disabled={isSubmitting}
              label={isSubmitting ? t('auth.signingIn') : t('auth.signIn')}
              loading={isSubmitting}
              onPress={handleLogin}
              style={styles.cta}
            />
            <Link asChild href="/register">
              <Pressable style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.7 }]}>
                <Text style={styles.link}>{t('auth.createAccount')}</Text>
              </Pressable>
            </Link>
          </AuthFormSurface>
        </ScrollView>
      </KeyboardAvoidingView>
    </AuthGradientBackground>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: figma.screen.horizontal
  },
  top: {
    alignItems: 'center',
    marginBottom: 28
  },
  title: {
    color: figma.color.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.6,
    marginTop: 20,
    textAlign: 'center'
  },
  subtitle: {
    color: figma.color.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 320,
    textAlign: 'center'
  },
  card: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center'
  },
  cta: {
    marginTop: 4,
    marginBottom: 10
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 4
  },
  link: {
    color: figma.color.primary,
    fontSize: 15,
    fontWeight: '600'
  }
});
