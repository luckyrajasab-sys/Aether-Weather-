// Utility functions for formatting weather data, unit conversions, and classification

export const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'Sun', group: 'clear', isDayIcon: 'Sun', isNightIcon: 'Moon' },
  1: { label: 'Mainly Clear', icon: 'SunCloud', group: 'clear', isDayIcon: 'SunDim', isNightIcon: 'CloudMoon' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', group: 'cloudy', isDayIcon: 'CloudSun', isNightIcon: 'CloudMoon' },
  3: { label: 'Overcast', icon: 'Cloud', group: 'cloudy', isDayIcon: 'Cloud', isNightIcon: 'Cloud' },
  45: { label: 'Foggy', icon: 'CloudFog', group: 'fog', isDayIcon: 'CloudFog', isNightIcon: 'CloudFog' },
  48: { label: 'Rime Fog', icon: 'CloudFog', group: 'fog', isDayIcon: 'CloudFog', isNightIcon: 'CloudFog' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', group: 'rain', isDayIcon: 'CloudDrizzle', isNightIcon: 'CloudDrizzle' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', group: 'rain', isDayIcon: 'CloudDrizzle', isNightIcon: 'CloudDrizzle' },
  55: { label: 'Dense Drizzle', icon: 'CloudRain', group: 'rain', isDayIcon: 'CloudRain', isNightIcon: 'CloudRain' },
  56: { label: 'Light Freezing Drizzle', icon: 'CloudHail', group: 'snow', isDayIcon: 'CloudHail', isNightIcon: 'CloudHail' },
  57: { label: 'Dense Freezing Drizzle', icon: 'CloudHail', group: 'snow', isDayIcon: 'CloudHail', isNightIcon: 'CloudHail' },
  61: { label: 'Slight Rain', icon: 'CloudRain', group: 'rain', isDayIcon: 'CloudRain', isNightIcon: 'CloudRain' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', group: 'rain', isDayIcon: 'CloudRain', isNightIcon: 'CloudRain' },
  65: { label: 'Heavy Rain', icon: 'CloudRainWind', group: 'rain', isDayIcon: 'CloudRainWind', isNightIcon: 'CloudRainWind' },
  66: { label: 'Freezing Rain', icon: 'CloudHail', group: 'snow', isDayIcon: 'CloudHail', isNightIcon: 'CloudHail' },
  67: { label: 'Heavy Freezing Rain', icon: 'CloudHail', group: 'snow', isDayIcon: 'CloudHail', isNightIcon: 'CloudHail' },
  71: { label: 'Slight Snow', icon: 'CloudSnow', group: 'snow', isDayIcon: 'CloudSnow', isNightIcon: 'CloudSnow' },
  73: { label: 'Moderate Snow', icon: 'CloudSnow', group: 'snow', isDayIcon: 'CloudSnow', isNightIcon: 'CloudSnow' },
  75: { label: 'Heavy Snow', icon: 'Snowflake', group: 'snow', isDayIcon: 'Snowflake', isNightIcon: 'Snowflake' },
  77: { label: 'Snow Grains', icon: 'Snowflake', group: 'snow', isDayIcon: 'Snowflake', isNightIcon: 'Snowflake' },
  80: { label: 'Light Showers', icon: 'CloudDrizzle', group: 'rain', isDayIcon: 'CloudDrizzle', isNightIcon: 'CloudDrizzle' },
  81: { label: 'Moderate Showers', icon: 'CloudRain', group: 'rain', isDayIcon: 'CloudRain', isNightIcon: 'CloudRain' },
  82: { label: 'Violent Showers', icon: 'CloudRainWind', group: 'rain', isDayIcon: 'CloudRainWind', isNightIcon: 'CloudRainWind' },
  85: { label: 'Snow Showers', icon: 'CloudSnow', group: 'snow', isDayIcon: 'CloudSnow', isNightIcon: 'CloudSnow' },
  86: { label: 'Heavy Snow Showers', icon: 'Snowflake', group: 'snow', isDayIcon: 'Snowflake', isNightIcon: 'Snowflake' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', group: 'storm', isDayIcon: 'CloudLightning', isNightIcon: 'CloudLightning' },
  96: { label: 'Thunderstorm & Hail', icon: 'CloudLightning', group: 'storm', isDayIcon: 'CloudLightning', isNightIcon: 'CloudLightning' },
  99: { label: 'Heavy Hailstorm', icon: 'CloudLightning', group: 'storm', isDayIcon: 'CloudLightning', isNightIcon: 'CloudLightning' }
};

export const getWeatherCondition = (code, isDay = 1) => {
  const meta = WMO_CODE_MAP[code] || { label: 'Clear', icon: 'Sun', group: 'clear' };
  let group = meta.group;
  if (!isDay && group === 'clear') {
    group = 'night';
  }
  return {
    ...meta,
    weatherGroup: group,
    iconName: isDay ? (meta.isDayIcon || meta.icon) : (meta.isNightIcon || 'Moon')
  };
};

export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);
export const fahrenheitToCelsius = (f) => Math.round(((f - 32) * 5) / 9);

export const formatTemperature = (tempCelsius, unit = 'C') => {
  if (tempCelsius === null || tempCelsius === undefined || isNaN(tempCelsius)) return '--';
  const val = unit === 'F' ? celsiusToFahrenheit(tempCelsius) : Math.round(tempCelsius);
  return `${val}°${unit}`;
};

export const formatRawTemp = (tempCelsius, unit = 'C') => {
  if (tempCelsius === null || tempCelsius === undefined || isNaN(tempCelsius)) return 0;
  return unit === 'F' ? celsiusToFahrenheit(tempCelsius) : Math.round(tempCelsius);
};

export const kmhToMph = (kmh) => Math.round(kmh * 0.621371);

export const formatWindSpeed = (speedKmh, unit = 'C') => {
  if (speedKmh === null || speedKmh === undefined || isNaN(speedKmh)) return '--';
  if (unit === 'F') {
    return `${kmhToMph(speedKmh)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
};

export const getWindDirection = (degree) => {
  if (degree === undefined || degree === null) return 'N';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((degree % 360) / 22.5) % 16;
  return directions[index];
};

export const getUVLevel = (uv) => {
  if (uv === undefined || uv === null || isNaN(uv)) return { level: 'Low', color: '#10B981', desc: 'Minimal danger for average person' };
  if (uv < 3) return { level: 'Low', color: '#10B981', desc: 'Minimal risk of sun harm' };
  if (uv < 6) return { level: 'Moderate', color: '#FBBF24', desc: 'Wear sunscreen and sunglasses' };
  if (uv < 8) return { level: 'High', color: '#F97316', desc: 'Cover up and use SPF 30+' };
  if (uv < 11) return { level: 'Very High', color: '#EF4444', desc: 'Avoid sun during peak hours' };
  return { level: 'Extreme', color: '#8B5CF6', desc: 'Stay indoors or in full shade' };
};

export const getAQILevel = (aqi) => {
  if (aqi === undefined || aqi === null || isNaN(aqi)) return { level: 'Good', color: '#10B981', category: 'Satisfactory air quality' };
  if (aqi <= 50) return { level: 'Good', color: '#10B981', category: 'Air quality is satisfactory and poses little or no risk.' };
  if (aqi <= 100) return { level: 'Moderate', color: '#FBBF24', category: 'Air quality is acceptable for most, sensitive people should limit exertion.' };
  if (aqi <= 150) return { level: 'Unhealthy for Sensitive Groups', color: '#F97316', category: 'Sensitive individuals may experience irritation.' };
  if (aqi <= 200) return { level: 'Unhealthy', color: '#EF4444', category: 'Everyone may begin to experience health effects.' };
  if (aqi <= 300) return { level: 'Very Unhealthy', color: '#8B5CF6', category: 'Health alert: risk of more serious health effects.' };
  return { level: 'Hazardous', color: '#7E22CE', category: 'Emergency health warning: serious impact on entire population.' };
};

export const formatTime = (isoString, timezone = 'UTC') => {
  if (!isoString) return '--:--';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: timezone
    }).format(date);
  } catch {
    return isoString.split('T')[1]?.slice(0, 5) || '--:--';
  }
};

export const formatDate = (isoString, timezone = 'UTC') => {
  if (!isoString) return '';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      timeZone: timezone
    }).format(date);
  } catch {
    return isoString.split('T')[0] || '';
  }
};

export const getDayName = (isoString, timezone = 'UTC', isToday = false) => {
  if (isToday) return 'Today';
  try {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      timeZone: timezone
    }).format(date);
  } catch {
    return 'Day';
  }
};
