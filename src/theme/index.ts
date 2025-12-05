import {MD3LightTheme as DefaultTheme} from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
    primaryContainer: '#E3F2FD',
    secondary: '#34C759',
    secondaryContainer: '#E8F5E8',
    tertiary: '#FF9500',
    error: '#FF3B30',
    errorContainer: '#FFEBEE',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F1F1',
    outline: '#C7C7CC',
    outlineVariant: '#E5E5EA',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onSurface: '#000000',
    onSurfaceVariant: '#48484A',
    onBackground: '#000000',
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const typography = {
  headingLarge: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  headingMedium: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 30,
  },
  headingSmall: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  bodyLarge: {
    fontSize: 17,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export type Theme = typeof theme;