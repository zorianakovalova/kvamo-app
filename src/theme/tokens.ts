/**
 * Kvamo design tokens.
 * Source: Figma "QUAMO Design" → Foundations (Колір 2.0) and the Path (Шлях) screen.
 * Primitives are raw palette values; semantic tokens are what components use.
 */

export const palette = {
  green: {
    50: '#eef8e3',
    lime: '#c6eb7a',
    500: '#3db769',
    700: '#1f6b3f',
  },
  gray: {
    0: '#ffffff',
    50: '#f7f8f7',
    100: '#eff1f0',
    200: '#e0e4e2',
    300: '#c5ccc8',
    400: '#858e89',
    600: '#5d6761',
    700: '#3c4641',
    800: '#28312c',
    900: '#1b211e',
  },
  blue: { 50: '#e6f1fb', 200: '#b9d4f2', 500: '#4a8bd6', 700: '#235a99' },
  yellow: { 50: '#fff6dc', 200: '#ffe58f', 500: '#ffc75a', 700: '#8a6100' },
  red: { 50: '#fcebe6', 200: '#f3c9bd', 500: '#f2662f', 700: '#b8321a' },
} as const;

export const colors = {
  textPrimary: palette.gray[900],
  textSecondary: palette.gray[600],
  textTertiary: palette.gray[400],
  textOnDark: palette.gray[0],
  brand: palette.green[700],
  progress: palette.green[500],
  accent: palette.green.lime,
  ink: palette.gray[900],
  surface: palette.gray[0],
  surfaceSubtle: palette.gray[50],
  surfaceGlass: 'rgba(255,255,255,0.8)',
  surfaceGlassSoft: 'rgba(255,255,255,0.58)',
  borderGlass: 'rgba(255,255,255,0.9)',
  border: palette.gray[200],
  track: 'rgba(27,33,30,0.14)',
  streakText: palette.red[700],
  streakIcon: palette.red[500],
  star: '#f0a500',
} as const;

/** Each learning module has its own accent (used on the module icon and upcoming cubes). */
export const moduleColors = {
  budget: { accent: palette.green.lime, sideL: ['#dcebd2', '#c9e2bd'], sideR: ['#eef6e8', '#e0efd6'] },
  savings: { accent: palette.blue[200], sideL: ['#b9d4f2', '#b9d4f2'], sideR: ['#dde9f8', '#dde9f8'] },
  investing: { accent: palette.red[200], sideL: ['#f3c9bd', '#f3c9bd'], sideR: ['#fbe4dd', '#fbe4dd'] },
} as const;
export type ModuleTheme = keyof typeof moduleColors;

export const fonts = {
  display: 'Unbounded_600SemiBold',
  regular: 'Onest_400Regular',
  medium: 'Onest_500Medium',
  semibold: 'Onest_600SemiBold',
  bold: 'Onest_700Bold',
} as const;

export const type = {
  screenTitle: { fontFamily: fonts.display, fontSize: 28, lineHeight: 34 },
  moduleTitle: { fontFamily: fonts.display, fontSize: 18, lineHeight: 22 },
  title: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 19 },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 },
  label: { fontFamily: fonts.semibold, fontSize: 14, lineHeight: 18 },
  caption: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 16 },
  overline: { fontFamily: fonts.semibold, fontSize: 11, lineHeight: 14, letterSpacing: 0.66 },
  tab: { fontFamily: fonts.medium, fontSize: 11, lineHeight: 14 },
} as const;
export type TypeVariant = keyof typeof type;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32 } as const;
export const radius = { sm: 12, md: 14, lg: 20, xl: 24, pill: 999 } as const;

export const shadow = {
  card: {
    shadowColor: palette.green[700],
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  tabBar: {
    shadowColor: palette.gray[900],
    shadowOpacity: 0.18,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;
