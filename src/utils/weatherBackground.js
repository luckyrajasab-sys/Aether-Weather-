// High-Definition Nature Photography Resolver for Weather Conditions

export const NATURE_WEATHER_BACKGROUNDS = {
  clear: {
    // Sunlit alpine valley & meadows under bright sunny skies
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2560&q=85',
    title: 'Sunlit Mountain Valley',
    tagline: 'Bright & Radiant Sunlight over Alpine Nature',
    weatherTheme: 'clear'
  },
  night: {
    // Serene mountain wilderness under brilliant starry night sky
    imageUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2560&q=85',
    title: 'Starlit Mountain Wilderness',
    tagline: 'Clear Cosmic Night over Nature Horizon',
    weatherTheme: 'night'
  },
  cloudy: {
    // Rolling green mountain ridges under dramatic overcast clouds
    imageUrl: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=2560&q=85',
    title: 'Rolling Overcast Ridges',
    tagline: 'Soft Cloud Cover over Mountain Hills',
    weatherTheme: 'cloudy'
  },
  rain: {
    // Rain falling and splashing directly on the ground with water ripples
    imageUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=2560&q=85',
    backupUrl: 'https://images.unsplash.com/photo-1541675154750-0444c7d51e8e?auto=format&fit=crop&w=2560&q=85',
    title: 'Rain Falling on Ground',
    tagline: 'Raindrops Splashing & Water Ripples on Ground',
    weatherTheme: 'rain'
  },
  storm: {
    // Dramatic thunderstorm and lightning over wild mountain landscape
    imageUrl: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=2560&q=85',
    title: 'Dramatic Storm Landscape',
    tagline: 'Monsoon Tempest over Wild Nature',
    weatherTheme: 'storm'
  },
  snow: {
    // Pristine snow-covered pine forest and frozen winter mountains
    imageUrl: 'https://images.unsplash.com/photo-1491002052546-bf38f186af56?auto=format&fit=crop&w=2560&q=85',
    title: 'Pristine Snow-Covered Pines',
    tagline: 'Winter Snowscape & Frozen Forest',
    weatherTheme: 'snow'
  },
  fog: {
    // Morning mist rising through lush evergreen nature valley
    imageUrl: 'https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=2560&q=85',
    title: 'Misty Woodland Valley',
    tagline: 'Ethereal Morning Fog through Pine Forest',
    weatherTheme: 'fog'
  },
  windy: {
    // Wind-swept coastal nature dunes and swaying grasslands
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2560&q=85',
    title: 'Wind-Swept Coastal Horizon',
    tagline: 'Breezy Air Currents over Natural Coast',
    weatherTheme: 'windy'
  }
};

/**
 * Returns the nature photography background matching the condition and day/night state
 */
export const getNatureWeatherMeta = (location, weatherGroup = 'clear', isDay = 1) => {
  const cityName = (location?.name || 'Local').trim();
  
  let key = weatherGroup;
  if (!isDay && (weatherGroup === 'clear' || weatherGroup === 'clouds')) {
    key = 'night';
  } else if (!NATURE_WEATHER_BACKGROUNDS[key]) {
    key = isDay ? 'clear' : 'night';
  }

  const bg = NATURE_WEATHER_BACKGROUNDS[key] || NATURE_WEATHER_BACKGROUNDS.clear;

  return {
    ...bg,
    cityName,
    heroImage: bg.imageUrl,
    fullTitle: `${cityName} • ${bg.title}`,
    isDay: Boolean(isDay)
  };
};

// Legacy compatibility
export const getBackgroundMeta = (location, weatherGroup = 'clear', isDay = 1) => {
  return getNatureWeatherMeta(location, weatherGroup, isDay);
};

export const getAnimatedWeatherMeta = (location, weatherGroup = 'clear', isDay = 1) => {
  return getNatureWeatherMeta(location, weatherGroup, isDay);
};


