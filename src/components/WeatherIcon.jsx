import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudRainWind,
  CloudDrizzle,
  CloudLightning,
  CloudSnow,
  Snowflake,
  CloudFog,
  CloudHail,
  SunMedium,
  SunDim
} from 'lucide-react';

export const WeatherIcon = ({ name = 'Sun', size = 32, className = '', color }) => {
  const iconMap = {
    Sun,
    Moon,
    Cloud,
    CloudSun,
    CloudMoon,
    SunCloud: CloudSun,
    CloudRain,
    CloudRainWind,
    CloudDrizzle,
    CloudLightning,
    CloudSnow,
    Snowflake,
    CloudFog,
    CloudHail,
    SunMedium,
    SunDim
  };

  const IconComponent = iconMap[name] || Sun;
  return <IconComponent size={size} className={className} color={color} strokeWidth={1.75} />;
};

export default WeatherIcon;
