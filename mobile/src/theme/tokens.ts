/**
 * MonAIQ — four-color system: #F5F5F2 (light), #D4AF37 (gold), #A8B6A0 (sage), #1A1F2B (ink).
 */
export const theme = {
  colors: {
    background: '#F5F5F2',
    backgroundIce: '#F5F5F2',
    glassOverlay: 'rgba(245, 245, 242, 0.94)',
    cardBorder: 'rgba(168, 182, 160, 0.4)',
    textPrimary: '#0A0C0F',
    textSecondary: 'rgba(8, 10, 15, 0.88)',
    textMuted: '#3D463F',
    /** Accent / CTA */
    accent: '#D4AF37',
    primary: '#D4AF37',
    primarySecondary: '#D4AF37',
    accentLight: 'rgba(212, 175, 55, 0.75)',
    /** Legacy names — map to brand gold for existing call sites */
    primaryEmerald: '#D4AF37',
    primaryEmeraldMuted: 'rgba(212, 175, 55, 0.14)',
    royalBlue: 'rgba(212, 175, 55, 0.9)',
    royalBlueMuted: 'rgba(212, 175, 55, 0.14)',
    danger: '#0A0C0F',
    warning: '#A8B6A0',
    innerGlow: 'rgba(168, 182, 160, 0.2)',
    /** Text / icons on gold buttons */
    onAccent: '#0A0C0F',
    card: '#F5F5F2'
  },
  radius: {
    xl: 22,
    lg: 18,
    md: 16,
    full: 9999
  },
  spacing: {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
    section: 20,
    screenBottom: 20
  },
  blur: {
    /** iOS BlurView intensity for cards / small surfaces */
    glass: 40,
    /** Header / bottom tab chrome (still readable) */
    chrome: 56
  },
  motion: {
    fast: 180,
    medium: 220,
    ease: 'ease-out' as const
  }
} as const;
