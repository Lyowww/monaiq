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
import { Link, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authApi } from '../../src/features/auth/api/authApi';
import { useAuthStore } from '../../src/features/auth/store/useAuthStore';
import { useUiStore } from '../../src/features/ui/store/useUiStore';
import { translate } from '../../src/locales/i18n';
import { AuthBrandMark } from '../../src/components/auth/AuthBrandMark';
import { AuthFormSurface } from '../../src/components/auth/AuthFormSurface';
import { AuthGradientBackground } from '../../src/components/auth/AuthGradientBackground';
import { AuthPrimaryButton } from '../../src/components/auth/AuthPrimaryButton';
import {
  AuthDateField,
  dateToYyyyMmDd,
  defaultBirthDate
} from '../../src/components/auth/AuthDateField';
import { AuthTextField } from '../../src/components/auth/AuthTextField';
import { figma } from '../../src/theme/figma';

export default function RegisterScreen() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const lang = useUiStore((s) => s.appLanguage);
  const t = (key: string, params?: Record<string, string | number>) => translate(lang, key, params);
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState(defaultBirthDate);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async (): Promise<void> => {
    try {
      setIsSubmitting(true);
      const session = await authApi.register({
        firstName,
        lastName,
        email,
        password,
        dateOfBirth: dateToYyyyMmDd(dob),
        deviceName: 'Expo Mobile'
      });

      await setSession(session);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('auth.registerError');
      Alert.alert(t('auth.registerFailed'), message);
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
            { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.navRow}>
            <Pressable
              accessibilityLabel={t('common.back')}
              hitSlop={12}
              onPress={() => router.replace('/login')}
              style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.6 }]}
            >
              <Ionicons color={figma.color.text} name="chevron-back" size={28} />
            </Pressable>
          </View>

          <View style={styles.header}>
            <AuthBrandMark size={64} />
            <Text style={styles.title}>{t('auth.registerTitle')}</Text>
            <Text style={styles.subtitle}>{t('auth.registerSubtitle')}</Text>
          </View>

          <AuthFormSurface style={styles.card}>
            <AuthTextField
              autoCapitalize="words"
              label={t('auth.firstName')}
              onChangeText={setFirstName}
              value={firstName}
            />
            <AuthTextField
              autoCapitalize="words"
              label={t('auth.lastName')}
              onChangeText={setLastName}
              value={lastName}
            />
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
            <AuthDateField
              appLanguage={lang}
              closeLabel={t('common.close')}
              label={t('auth.dob')}
              onChange={setDob}
              value={dob}
            />
            <AuthPrimaryButton
              disabled={isSubmitting}
              label={isSubmitting ? t('auth.creating') : t('auth.createAccountBtn')}
              loading={isSubmitting}
              onPress={handleRegister}
              style={styles.cta}
            />
            <Link asChild href="/login">
              <Pressable style={({ pressed }) => [styles.linkWrap, pressed && { opacity: 0.7 }]}>
                <Text style={styles.link}>{t('auth.hasAccount')}</Text>
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
  navRow: {
    marginBottom: 8
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 4
  },
  header: {
    marginBottom: 24,
    alignItems: 'center'
  },
  title: {
    color: figma.color.text,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginTop: 16,
    textAlign: 'center'
  },
  subtitle: {
    color: figma.color.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
    maxWidth: 340
  },
  card: {
    maxWidth: 420,
    width: '100%',
    alignSelf: 'center',
    marginBottom: 8
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
