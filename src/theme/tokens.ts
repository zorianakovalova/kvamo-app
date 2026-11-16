import { Platform } from 'react-native';

/**
 * Kvamo design tokens, taken from Figma "QUAMO Design" (Design System page and the screens).
 * Primitives are raw palette values; semantic tokens are what components use.
 */

export const palette = {
  ink: '#0b100d',
  inverse: '#f7f9f7',
  brand: '#1f6b3f',
  lime: '#c6eb7a',
  peach: '#f3c9bd',
  blue: '#b9d4f2',
  sun: '#ffe58f',
  white: '#ffffff',
  gray: { 50: '#f6f8f6', 100: '#edf1ee', 200: '#dfe5e1', 300: '#c8d0cb' },
  orange: '#f2662f',
  star: '#fbbc05',
  danger: '#c0392b',
} as const;

export const colors = {
  textPrimary: palette.ink,
  textSecondary: 'rgba(11,16,13,0.6)',
  textTertiary: 'rgba(11,16,13,0.4)',
  textInverse: palette.inverse,
  textOnDark: palette.inverse,
  brand: palette.brand,
  accent: palette.lime,
  ink: palette.ink,
  surface: palette.white,
  surfaceSubtle: palette.gray[50],
  glassStrong: 'rgba(255,255,255,0.88)',
  glass: 'rgba(255,255,255,0.72)',
  borderGlass: 'rgba(255,255,255,0.9)',
  border: palette.gray[200],
  borderStrong: palette.gray[300],
  borderCard: 'rgba(20,35,26,0.06)',
  backgroundTertiary: palette.gray[100],
  progressTodo: 'rgba(118,138,126,0.16)',
  streakIcon: palette.orange,
  star: palette.star,
  danger: palette.danger,
  /** feedback/error/text from Figma (destructive rows and buttons). */
  error: '#b8321a',
  positive: '#2f9a52',
  dangerSurface: '#fdecea',
} as const;

/** Each learning module has its own accent (onboarding cards, library). */
export const moduleColors = {
  budget: { accent: palette.lime },
  savings: { accent: palette.blue },
  investing: { accent: palette.peach },
} as const;
export type ModuleTheme = keyof typeof moduleColors;

/** Unbounded for display text; the system font (SF Pro on iOS) for everything else, as in Figma. */
export const fonts = {
  display: 'Unbounded_600SemiBold',
  system: Platform.select({ ios: 'System', default: undefined }),
} as const;

const sys = (fontSize: number, lineHeight: number, fontWeight: '400' | '500' | '600', letterSpacing = 0) => ({
  fontFamily: fonts.system,
  fontSize,
  lineHeight,
  fontWeight,
  letterSpacing,
});
const display = (fontSize: number, lineHeight: number, letterSpacing = 0) => ({
  fontFamily: fonts.display,
  fontSize,
  lineHeight,
  letterSpacing,
});

export const type = {
  wordmark: display(80, 88, -1.6),
  displayLarge: display(40, 46, -0.8),
  largeTitle: display(30, 36, -0.3),
  title1: display(24, 30, -0.24),
  numberMedium: display(24, 30),
  numberSmall: display(16, 20),
  numberXs: display(12, 16),
  title3: sys(20, 25, '600', -0.45),
  headline: sys(17, 22, '600', -0.43),
  body: sys(17, 22, '400', -0.43),
  bodyMedium: sys(17, 22, '500', -0.43),
  subheadline: sys(15, 20, '400', -0.23),
  subheadlineMedium: sys(15, 20, '500', -0.23),
  subheadlineStrong: sys(15, 20, '600', -0.23),
  footnote: sys(13, 18, '400', -0.08),
  caption: sys(12, 16, '400'),
  captionStrong: sys(12, 16, '600'),
  captionMedium: sys(12, 16, '500'),
  caption2: sys(11, 13, '600', 0.66),
} as const;
export type TypeVariant = keyof typeof type;

export const space = { xxs: 2, xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radius = { xs: 4, control: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, pill: 999 } as const;

export const shadow = {
  /** shadow/ink-6 from Figma: 0 8 20 rgba(20,35,26,0.06). */
  ink6: {
    shadowColor: '#14231a',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  tabBar: {
    shadowColor: '#14231a',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
} as const;
