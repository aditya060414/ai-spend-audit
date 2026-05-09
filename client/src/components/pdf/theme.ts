import type { PdfTheme, ChartColor } from '../../types';

export interface ThemeConfig {
  pageBg: string;
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

export const getThemeConfig = (theme: PdfTheme, colorMode: ChartColor, compactMode: boolean): ThemeConfig => {
  // Base themes
  let base: Omit<ThemeConfig, 'chartColors' | 'spacing'>;
  
  switch (theme) {
    case 'light-corporate':
      base = {
        pageBg: 'bg-white',
        textPrimary: 'text-zinc-900',
        textSecondary: 'text-zinc-600',
        textMuted: 'text-zinc-400',
        borderPrimary: 'border-zinc-200',
        borderSecondary: 'border-zinc-100',
        cardBg: 'bg-white',
        cardBgSecondary: 'bg-zinc-50',
        headerGradient: 'bg-gradient-to-b from-zinc-100 via-transparent to-transparent',
        headerGradientText: 'from-zinc-900 to-zinc-600',
        tableHeaderBg: 'bg-zinc-50',
      };
      break;
    case 'dark-executive':
    default:
      base = {
        pageBg: 'bg-[#09090b]',
        textPrimary: 'text-[#fafafa]',
        textSecondary: 'text-zinc-400',
        textMuted: 'text-zinc-500',
        borderPrimary: 'border-zinc-800',
        borderSecondary: 'border-zinc-800/50',
        cardBg: 'bg-zinc-900/80',
        cardBgSecondary: 'bg-zinc-900/30',
        headerGradient: 'bg-gradient-to-b from-zinc-900/50 via-transparent to-transparent',
        headerGradientText: 'from-white to-zinc-400',
        tableHeaderBg: 'bg-zinc-900',
      };
      break;
  }

  // Chart Colors (Using visually distinct, accessible palettes)
  let chartColors: string[];
  switch (colorMode) {
    case 'blue':
      chartColors = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe'];
      break;
    case 'green':
      chartColors = ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#d1fae5'];
      break;
    case 'purple':
      chartColors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe'];
      break;
    case 'orange':
      chartColors = ['#f97316', '#fb923c', '#fdba74', '#fed7aa', '#ffedd5'];
      break;
    case 'monochrome':
      // Differentiable gray scales for grayscale printing
      chartColors = theme === 'light-corporate' 
        ? ['#27272a', '#52525b', '#71717a', '#a1a1aa', '#d4d4d8']
        : ['#f4f4f5', '#d4d4d8', '#a1a1aa', '#71717a', '#52525b'];
      break;
    default:
      chartColors = ['#3b82f6', '#10b981', '#8b5cf6', '#f97316', '#eab308'];
  }

  // Spacing configurations
  const spacing = compactMode ? {
    section: 'mb-4',
    card: 'p-3',
    heading: 'mb-3',
  } : {
    section: 'mb-8',
    card: 'p-6',
    heading: 'mb-5',
  };

  return { ...base, chartColors, spacing };
};
