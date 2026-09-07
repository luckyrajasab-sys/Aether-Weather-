import React, { useState, useEffect } from 'react';
import {
  MapPin,
  ArrowUp,
  ArrowDown,
  Clock,
  Droplets,
  Wind,
  Cloud
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import AnimatedNumber from './AnimatedNumber';
import TiltCard from './TiltCard';
import { formatRawTemp } from '../utils/formatWeatherData';

export const WeatherHero = ({ weather, location, tempUnit }) => {
  const { current, timezone } = weather;
  const [localTime, setLocalTime] = useState('');
  const [localDate, setLocalDate] = useState('');

  // Live ticking time for the location's timezone
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeStr = new Intl.DateTimeFormat('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
          timeZone: timezone || 'UTC'
        }).format(now);

        const dateStr = new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
          timeZone: timezone || 'UTC'
        }).format(now);

        setLocalTime(timeStr);
        setLocalDate(dateStr);
      } catch {
        setLocalTime(now.toLocaleTimeString());
        setLocalDate(now.toDateString());
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezone]);

  const rawCurrentTemp = formatRawTemp(current.temperature, tempUnit);
  const rawFeelsLike = formatRawTemp(current.apparentTemperature, tempUnit);
  const rawMax = formatRawTemp(current.maxTemp, tempUnit);
  const rawMin = formatRawTemp(current.minTemp, tempUnit);

  return (
    <TiltCard className="hero-weather-card animate-fade-in" maxTilt={5}>
      {/* Left Info Column */}
      <div className="hero-main-info">
        <div className="hero-location-badge">
          <MapPin size={22} color="var(--accent-color)" />
          <span>{[location.name, location.country].filter(Boolean).join(', ')}</span>
        </div>

        <h2 className="hero-location-name">
          {location.name}
        </h2>

        <div className="hero-datetime">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Clock size={16} />
            <span>{localTime || '--:--'}</span>
          </div>
          <span>•</span>
          <span>{localDate || 'Today'}</span>
        </div>

        <div className="hero-temp-row">
          <div className="hero-big-temp">
            <AnimatedNumber value={rawCurrentTemp} />
            <span style={{ fontSize: '3.2rem', fontWeight: 600, color: 'var(--text-secondary)' }}>°{tempUnit}</span>
          </div>

          <div className="hero-condition-col">
            <span className="hero-condition-text">{current.condition}</span>
            <span className="hero-feels-like">
              Feels like <AnimatedNumber value={rawFeelsLike} />°{tempUnit}
            </span>
          </div>
        </div>

        <div className="hero-high-low">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#F59E0B' }}>
            <ArrowUp size={16} />
            H: <AnimatedNumber value={rawMax} />°{tempUnit}
          </span>
          <span style={{ color: 'var(--text-dim)' }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#38BDF8' }}>
            <ArrowDown size={16} />
            L: <AnimatedNumber value={rawMin} />°{tempUnit}
          </span>
        </div>
      </div>

      {/* Right Visual & Mini Stats */}
      <div className="hero-visual-side">
        <div className="hero-large-icon">
          <WeatherIcon
            name={current.iconName}
            size={120}
            color="var(--accent-color)"
          />
        </div>

        <div className="hero-stats-mini-grid">
          <div className="hero-mini-stat">
            <span className="hero-mini-stat-label">Humidity</span>
            <span className="hero-mini-stat-val">
              <AnimatedNumber value={Math.round(current.humidity || 0)} />%
            </span>
          </div>
          <div className="hero-mini-stat">
            <span className="hero-mini-stat-label">Wind</span>
            <span className="hero-mini-stat-val">
              <AnimatedNumber value={Math.round(current.windSpeed || 0)} />
              <span style={{ fontSize: '0.75rem', fontWeight: 500, marginLeft: '2px' }}>km/h</span>
            </span>
          </div>
          <div className="hero-mini-stat">
            <span className="hero-mini-stat-label">Cloud</span>
            <span className="hero-mini-stat-val">
              <AnimatedNumber value={Math.round(current.cloudCover || 0)} />%
            </span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
};

export default WeatherHero;
