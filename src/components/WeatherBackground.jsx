import React, { useEffect, useState } from 'react';
import { getNatureWeatherMeta } from '../utils/weatherBackground';
import { WEATHER_THEMES } from '../utils/weatherColors';
import { Mountain } from 'lucide-react';

export const WeatherBackground = ({
  location,
  weatherGroup = 'clear',
  isDay = 1,
  isDarkMode = false
}) => {
  const theme = WEATHER_THEMES[weatherGroup] || WEATHER_THEMES.clear;
  const bgMeta = getNatureWeatherMeta(location, weatherGroup, isDay);
  const [imgSrc, setImgSrc] = useState(bgMeta.heroImage);

  useEffect(() => {
    setImgSrc(bgMeta.heroImage);
  }, [bgMeta.heroImage]);

  // Set CSS Root variables dynamically for smooth theme blending
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--glow-color', theme.glowColor);
    root.style.setProperty('--bg-gradient', theme.gradient);
    root.style.setProperty('--glass-bg', isDarkMode ? 'rgba(10, 15, 26, 0.72)' : 'rgba(15, 23, 42, 0.6)');
    root.style.setProperty('--glass-bg-hover', isDarkMode ? 'rgba(15, 23, 42, 0.85)' : 'rgba(30, 41, 59, 0.72)');
    root.style.setProperty('--glass-border', isDarkMode ? 'rgba(255, 255, 255, 0.16)' : 'rgba(255, 255, 255, 0.22)');
  }, [theme, isDarkMode]);

  return (
    <div className={`weather-bg-container weather-bg-${weatherGroup} ${!isDay ? 'is-night' : 'is-day'}`}>
      {/* High-Resolution Nature Weather Picture */}
      <img
        key={imgSrc}
        src={imgSrc}
        alt={bgMeta.title}
        onError={() => {
          if (bgMeta.backupUrl && imgSrc !== bgMeta.backupUrl) {
            setImgSrc(bgMeta.backupUrl);
          }
        }}
        className="weather-bg-image"
      />

      {/* Atmospheric Theme Gradient & Readability Overlays */}
      <div className="weather-bg-gradient" />
      <div className="weather-bg-overlay" />

      {/* Nature Weather Badge */}
      <div className="bg-landmark-badge">
        <div className="landmark-badge-icon">
          <Mountain size={15} color="#FBBF24" />
        </div>
        <div className="landmark-badge-content">
          <span className="landmark-badge-title">
            {bgMeta.title}
          </span>
          <span className="landmark-badge-subtitle">
            {bgMeta.tagline}
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeatherBackground;



