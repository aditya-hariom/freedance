export const THEME = {
  colors: {
    background: '#F4F6F8',      // Clean off-white background matching PDF Page 3
    surface: '#FFFFFF',         // Crisp white cards
    surfaceElevated: '#FFFFFF', 
    surfaceHighlight: '#F0FDFA', // Soft teal highlight
    border: '#E5E7EB',
    borderLight: '#F3F4F6',

    primary: '#0D9488',         // Teal/Cyan matching Feedants branding
    primaryHover: '#0F766E',
    primaryGlow: 'rgba(13, 148, 136, 0.15)',
    primaryLight: '#CCFBF1',

    secondary: '#111827',       // Dark Charcoal
    secondaryLight: '#F3F4F6',

    success: '#059669',         // Emerald green for Registered badge
    successLight: '#ECFDF5',
    successBorder: '#A7F3D0',

    danger: '#DC2626',          // Hurry up red
    dangerLight: '#FEF2F2',
    dangerBorder: '#FECACA',

    warning: '#D97706',         // Amber gold
    warningLight: '#FFFBEB',

    textPrimary: '#111827',     // Dark text for high contrast readability
    textSecondary: '#4B5563',
    textMuted: '#9CA3AF',
    textDark: '#FFFFFF',

    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.6)'
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 10,
    lg: 14,
    xl: 18,
    pill: 9999
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
      elevation: 2
    },
    floatingCta: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -3 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 8
    }
  }
};
