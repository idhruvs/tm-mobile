export const palette = {
  primary: '#1976D2',
  primaryDark: '#1565C0',
  primaryLight: '#BBDEFB',
  accent: '#FF6D00',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  error: '#D32F2F',
  success: '#388E3C',
  textPrimary: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  placeholder: '#9E9E9E',
};

// kept for compatibility with Themed.tsx and navigation
export default {
  light: {
    text: palette.textPrimary,
    background: palette.background,
    tint: palette.primary,
    tabIconDefault: palette.disabled,
    tabIconSelected: palette.primary,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#fff',
    tabIconDefault: '#ccc',
    tabIconSelected: '#fff',
  },
};
