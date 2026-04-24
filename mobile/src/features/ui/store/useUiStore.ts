import { create } from 'zustand';
import type { AppLanguage } from '../../../locales/i18n.types';

/** Set from Assistant — Analytics uses this for save-focused guidance. */
export type MoneyFocus = 'save' | null;

type UiState = {
  appLanguage: AppLanguage;
  ghostMode: boolean;
  advancedQuickOpen: boolean;
  moneyFocus: MoneyFocus;
  setAppLanguage: (next: AppLanguage) => void;
  toggleAppLanguage: () => void;
  setGhostMode: (next: boolean) => void;
  toggleAdvancedQuick: () => void;
  setMoneyFocus: (next: MoneyFocus) => void;
};

export const useUiStore = create<UiState>((set) => ({
  appLanguage: 'hy',
  ghostMode: false,
  advancedQuickOpen: false,
  moneyFocus: null,
  setAppLanguage: (appLanguage) => set({ appLanguage }),
  toggleAppLanguage: () =>
    set((s) => ({ appLanguage: s.appLanguage === 'en' ? 'hy' : 'en' })),
  setGhostMode: (ghostMode) => set({ ghostMode }),
  toggleAdvancedQuick: () => set((s) => ({ advancedQuickOpen: !s.advancedQuickOpen })),
  setMoneyFocus: (moneyFocus) => set({ moneyFocus })
}));
