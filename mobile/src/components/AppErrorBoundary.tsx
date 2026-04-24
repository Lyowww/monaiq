import type { ReactNode } from 'react';
import { Component } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useUiStore } from '../features/ui/store/useUiStore';
import { translate } from '../locales/i18n';
import { theme } from '../theme/tokens';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = {
    hasError: false
  };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return {
      hasError: true
    };
  }

  private reset = (): void => {
    this.setState({
      hasError: false
    });
  };

  render() {
    if (this.state.hasError) {
      const lang = useUiStore.getState().appLanguage;
      return (
        <View style={styles.container}>
          <Text style={styles.title}>{translate(lang, 'appError.title')}</Text>
          <Text style={styles.subtitle}>{translate(lang, 'appError.subtitle')}</Text>
          <Pressable onPress={this.reset} style={styles.button}>
            <Text style={styles.buttonLabel}>{translate(lang, 'appError.retry')}</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700'
  },
  subtitle: {
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm
  },
  button: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md
  },
  buttonLabel: {
    color: theme.colors.onAccent,
    fontWeight: '700'
  }
});
