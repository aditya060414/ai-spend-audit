import type { PdfTheme, ChartColor } from '../../types';

export interface ThemeConfig {
  pageBg: string;
  pageBgHex: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderPrimary: string;
  borderSecondary: string;
  cardBg: string;
  cardBgSecondary: string;
  headerGradient: string;
  headerGradientText: string;
  tableHeaderBg: string;
  spacing: {
    section: string;
    card: string;
    heading: string;
  };
  chartColors: string[];
}

export const getThemeConfig = (theme: PdfTheme, _colorMode: ChartColor, _compactMode: boolean): ThemeConfig => {
  let base: Omit<ThemeConfig, 'chartColors' | 'spacing'>;
  
  if (theme === 'light') {
    base = {
      pageBg: 'bg-[#ffffff]',
      pageBgHex: '#ffffff',
      textPrimary: 'text-[#09090b]',
      textSecondary: 'text-[#52525b]',
      textMuted: 'text-[#a1a1aa]',
      borderPrimary: 'border-[#e4e4e7]',
      borderSecondary: 'border-[#f4f4f5]',
      cardBg: 'bg-[#ffffff]',
      cardBgSecondary: 'bg-[#fafafa]',
      headerGradient: 'bg-transparent',
      headerGradientText: 'from-[#09090b] to-[#52525b]',
      tableHeaderBg: 'bg-[#fafafa]',
    };
  } else {
    // Dark Theme (#09090b based)
    base = {
      pageBg: 'bg-[#09090b]',
      pageBgHex: '#09090b',
      textPrimary: 'text-[#fafafa]',
      textSecondary: 'text-[#a1a1aa]',
      textMuted: 'text-[#52525b]',
      borderPrimary: 'border-[#27272a]',
      borderSecondary: 'border-[#18181b]',
      cardBg: 'bg-[#09090b]',
      cardBgSecondary: 'bg-[#18181b]',
      headerGradient: 'bg-transparent',
      headerGradientText: 'from-[#ffffff] to-[#a1a1aa]',
      tableHeaderBg: 'bg-[#18181b]',
    };
  }

  // Enterprise Chart Colors (Emerald for savings/optimism)
  const chartColors = theme === 'light' 
    ? ['#10b981', '#3b82f6', '#6366f1', '#a855f7', '#f43f5e']
    : ['#10b981', '#3b82f6', '#818cf8', '#c084fc', '#fb7185'];

  // Professional Spacing
  const spacing = {
    section: 'mb-10',
    card: 'p-6',
    heading: 'mb-6',
  };

  return { ...base, chartColors, spacing };
};
