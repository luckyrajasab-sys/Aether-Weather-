// Dynamic color schemes and gradients for weather conditions and UI themes

export const WEATHER_THEMES = {
  clear: {
    name: 'Sunny / Clear Sky',
    group: 'clear',
    primaryColor: '#F59E0B',
    secondaryColor: '#38BDF8',
    accentColor: '#FBBF24',
    glowColor: 'rgba(245, 158, 11, 0.35)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    glassBg: 'rgba(255, 255, 255, 0.12)',
    glassBgHover: 'rgba(255, 255, 255, 0.18)',
    glassBorder: 'rgba(255, 255, 255, 0.22)',
    gradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 40%, #fbbf24 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(14, 116, 144, 0.4) 0%, rgba(251, 191, 36, 0.25) 100%)',
    particleType: 'sun-rays',
    chartColor: '#FBBF24'
  },
  night: {
    name: 'Clear Night',
    group: 'night',
    primaryColor: '#818CF8',
    secondaryColor: '#312E81',
    accentColor: '#A78BFA',
    glowColor: 'rgba(129, 140, 248, 0.3)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.7)',
    glassBg: 'rgba(15, 23, 42, 0.35)',
    glassBgHover: 'rgba(30, 41, 59, 0.45)',
    glassBorder: 'rgba(148, 163, 184, 0.18)',
    gradient: 'linear-gradient(135deg, #030712 0%, #0f172a 40%, #1e1b4b 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(3, 7, 18, 0.6) 0%, rgba(30, 27, 75, 0.4) 100%)',
    particleType: 'stars',
    chartColor: '#A78BFA'
  },
  cloudy: {
    name: 'Cloudy / Overcast',
    group: 'cloudy',
    primaryColor: '#94A3B8',
    secondaryColor: '#475569',
    accentColor: '#CBD5E1',
    glowColor: 'rgba(148, 163, 184, 0.25)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    glassBg: 'rgba(255, 255, 255, 0.1)',
    glassBgHover: 'rgba(255, 255, 255, 0.16)',
    glassBorder: 'rgba(255, 255, 255, 0.2)',
    gradient: 'linear-gradient(135deg, #334155 0%, #475569 50%, #64748b 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(30, 41, 59, 0.5) 0%, rgba(100, 116, 139, 0.35) 100%)',
    particleType: 'clouds',
    chartColor: '#CBD5E1'
  },
  rain: {
    name: 'Rainy / Showers',
    group: 'rain',
    primaryColor: '#38BDF8',
    secondaryColor: '#0369A1',
    accentColor: '#60A5FA',
    glowColor: 'rgba(56, 189, 248, 0.3)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    glassBg: 'rgba(12, 74, 110, 0.22)',
    glassBgHover: 'rgba(12, 74, 110, 0.32)',
    glassBorder: 'rgba(125, 211, 252, 0.2)',
    gradient: 'linear-gradient(135deg, #082f49 0%, #0c4a6e 40%, #0369a1 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(8, 47, 73, 0.6) 0%, rgba(3, 105, 161, 0.4) 100%)',
    particleType: 'rain',
    chartColor: '#38BDF8'
  },
  storm: {
    name: 'Thunderstorm',
    group: 'storm',
    primaryColor: '#A855F7',
    secondaryColor: '#3B0764',
    accentColor: '#C084FC',
    glowColor: 'rgba(168, 85, 247, 0.35)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    glassBg: 'rgba(59, 7, 100, 0.25)',
    glassBgHover: 'rgba(88, 28, 135, 0.35)',
    glassBorder: 'rgba(192, 132, 252, 0.22)',
    gradient: 'linear-gradient(135deg, #090514 0%, #1e1035 45%, #3b0764 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(9, 5, 20, 0.7) 0%, rgba(59, 7, 100, 0.45) 100%)',
    particleType: 'storm',
    chartColor: '#C084FC'
  },
  snow: {
    name: 'Snowy / Winter',
    group: 'snow',
    primaryColor: '#7DD3FC',
    secondaryColor: '#E0F2FE',
    accentColor: '#BAE6FD',
    glowColor: 'rgba(125, 211, 252, 0.35)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.8)',
    glassBg: 'rgba(224, 242, 254, 0.15)',
    glassBgHover: 'rgba(224, 242, 254, 0.25)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0284c7 40%, #7dd3fc 85%, #e0f2fe 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(12, 74, 110, 0.5) 0%, rgba(224, 242, 254, 0.2) 100%)',
    particleType: 'snow',
    chartColor: '#7DD3FC'
  },
  fog: {
    name: 'Fog / Mist',
    group: 'fog',
    primaryColor: '#94A3B8',
    secondaryColor: '#334155',
    accentColor: '#CBD5E1',
    glowColor: 'rgba(148, 163, 184, 0.2)',
    textColor: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.75)',
    glassBg: 'rgba(51, 65, 85, 0.25)',
    glassBgHover: 'rgba(51, 65, 85, 0.35)',
    glassBorder: 'rgba(203, 213, 225, 0.2)',
    gradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #64748b 100%)',
    overlayGradient: 'linear-gradient(180deg, rgba(30, 41, 59, 0.6) 0%, rgba(100, 116, 139, 0.35) 100%)',
    particleType: 'mist',
    chartColor: '#CBD5E1'
  }
};

export const getThemeForCondition = (weatherGroup = 'clear', isDay = 1, isDarkMode = false) => {
  let themeKey = weatherGroup;
  if (!isDay && weatherGroup === 'clear') {
    themeKey = 'night';
  }
  const baseTheme = WEATHER_THEMES[themeKey] || WEATHER_THEMES.clear;
  
  if (isDarkMode) {
    return {
      ...baseTheme,
      glassBg: 'rgba(10, 15, 26, 0.45)',
      glassBgHover: 'rgba(15, 23, 42, 0.6)',
      glassBorder: 'rgba(255, 255, 255, 0.12)'
    };
  }
  return baseTheme;
};
