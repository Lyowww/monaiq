/**
 * MonAIQ design tokens — #F5F5F2, #D4AF37, #A8B6A0, #1A1F2B (+ alphas of the same).
 */
export const figma = {
  screen: {
    horizontal: 20,
    top: 12,
    bottomContentInset: 108,
    sectionGap: 20,
    cardPadding: 20
  },
  radius: {
    card: 18,
    chip: 24,
    tabBar: 22,
    avatar: 22,
    activityRow: 16,
    iconTile: 18
  },
  color: {
    bg: '#F5F5F2',
    bgElevated: '#F5F5F2',
    bgAlt: '#F5F5F2',
    text: '#0A0C0F',
    textSecondary: 'rgba(8, 10, 15, 0.86)',
    textMuted: '#3D463F',
    textLabel: '#3D463F',
    /** Brand */
    accentGold: '#D4AF37',
    softGold: 'rgba(212, 175, 55, 0.85)',
    neutralLight: '#F5F5F2',
    neutralGray: '#3D463F',
    divider: 'rgba(168, 182, 160, 0.45)',
    /** Semantic */
    primary: '#D4AF37',
    primaryDeep: '#D4AF37',
    primaryGlow: 'rgba(212, 175, 55, 0.22)',
    accent: '#D4AF37',
    accentSoft: 'rgba(212, 175, 55, 0.18)',
    /** Text on gold / FAB */
    onAccent: '#0A0C0F',
    /** Charts */
    positive: '#D4AF37',
    negative: 'rgba(8, 10, 15, 0.55)',
    chartOut: 'rgba(50, 58, 48, 0.82)',
    card: '#F5F5F2',
    /** Legacy aliases from prior theme */
    royalBlue: 'rgba(212, 175, 55, 0.9)',
    fabLime: '#D4AF37',
    fabLimeBorder: 'rgba(168, 182, 160, 0.5)',
    addPurple: '#D4AF37',
    actionTransfer: 'rgba(212, 175, 55, 0.1)',
    actionTopUp: 'rgba(212, 175, 55, 0.12)',
    actionWithdraw: 'rgba(26, 31, 43, 0.1)',
    actionMore: 'rgba(168, 182, 160, 0.25)',
    glassFill: 'rgba(245, 245, 242, 0.96)',
    /** Layered on top of BlurView so content stays high-contrast */
    glassOnBlur: 'rgba(245, 245, 242, 0.88)',
    glassStroke: 'rgba(168, 182, 160, 0.45)',
    shadow: 'rgba(26, 31, 43, 0.12)',
    /** Modal / dim scrim */
    overlay: 'rgba(26, 31, 43, 0.45)',
    /** Pressed / subtle surfaces */
    surfacePressed: 'rgba(168, 182, 160, 0.18)',

    /**
     * Premium dark chart well (fintech cards) — lines/columns on deep navy with gold + sage.
     */
    chartSurface: '#10141C',
    chartSurface2: '#151A24',
    chartSurfaceStroke: 'rgba(212, 175, 55, 0.22)',
    chartBarBase: 'rgba(8, 10, 15, 0.92)',
    chartBarMid: 'rgba(100, 112, 88, 0.65)',
    chartBarTop: 'rgba(212, 175, 55, 0.88)',
    chartBarSage: 'rgba(168, 182, 160, 0.45)',
    chartBarRim: 'rgba(255, 255, 255, 0.22)',
    chartAxisMuted: 'rgba(245, 245, 242, 0.38)',
    chartGrid: 'rgba(168, 182, 160, 0.1)',
    chartTooltip: 'rgba(212, 175, 55, 0.96)',
    chartTooltipText: '#0A0C0F',
    /** Outflow / secondary series on dark backgrounds */
    chartOutDark: 'rgba(195, 208, 188, 0.88)',
    chartOutGlowDark: 'rgba(168, 182, 160, 0.25)',

    /** Light chart well — minimal, high-contrast black type */
    chartSurfaceLight: '#FDFCF9',
    chartSurfaceLight2: '#F5F4F0',
    chartStrokeLight: 'rgba(168, 182, 160, 0.42)',
    chartTextInk: '#0A0C0F',
    chartTextSoft: 'rgba(8, 10, 15, 0.55)',
    chartGridLight: 'rgba(26, 31, 43, 0.07)',
    chartBarBaseLight: 'rgba(230, 232, 226, 0.95)',
    chartBarMidLight: 'rgba(200, 190, 140, 0.55)',
    chartBarSageLight: 'rgba(168, 182, 160, 0.5)',
    chartBarTopLight: 'rgba(212, 175, 55, 0.92)',
    chartBarRimLight: 'rgba(255, 255, 255, 0.7)',
    chartTooltipLight: 'rgba(255, 255, 255, 0.98)',
    chartTooltipBorder: 'rgba(26, 31, 43, 0.08)',
    /** Lines on light (cashflow) */
    chartOutLight: 'rgba(45, 58, 48, 0.88)',
    chartOutGlowLight: 'rgba(168, 182, 160, 0.35)',
    inAreaLight: 'rgba(212, 175, 55, 0.14)',
    inGlowLight: 'rgba(212, 175, 55, 0.28)'
  },
  actionIcon: {
    transfer: 'rgba(212, 175, 55, 0.9)',
    topUp: '#D4AF37',
    withdraw: '#3D463F',
    more: '#3D463F'
  },
  shadow: {
    tabBar: {
      shadowColor: '#1A1F2B',
      shadowOpacity: 0.16,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 8 }
    },
    fab: {
      shadowColor: '#1A1F2B',
      shadowOpacity: 0.2,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 }
    },
    card: {
      shadowColor: '#1A1F2B',
      shadowOpacity: 0.12,
      shadowRadius: 24,
      shadowOffset: { width: 0, height: 8 }
    },
    button: {
      shadowColor: '#1A1F2B',
      shadowOpacity: 0.08,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 }
    }
  },
  type: {
    title: 26,
    section: 18,
    balance: 34,
    balanceLabel: 13,
    welcome: 20,
    hello: 14,
    body: 15,
    caption: 12,
    tab: 10
  }
} as const;
