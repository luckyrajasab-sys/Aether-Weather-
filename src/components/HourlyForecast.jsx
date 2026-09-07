import React from 'react';
import { Clock, Droplet, Wind } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemperature, formatTime, kmhToMph } from '../utils/formatWeatherData';

const HourlyForecast = ({ hourly = [], tempUnit, timezone }) => {
  if (!hourly || hourly.length === 0) return null;

  return (
    <div className="glass-card hourly-forecast-container">
      <div className="section-title-row">
        <h3 className="section-title">
          <Clock size={20} color="var(--primary-color)" />
          <span>Hourly Forecast</span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Next 24 Hours
        </span>
      </div>

      <div className="hourly-scroll-track">
        {hourly.slice(0, 24).map((item, idx) => {
          const formattedHour = idx === 0 ? 'Now' : formatTime(item.time, timezone);
          const windDisplay = tempUnit === 'F' ? `${kmhToMph(item.windSpeed)}mph` : `${Math.round(item.windSpeed)}km/h`;

          return (
            <div
              key={`hour-${item.time}-${idx}`}
              className={`hourly-card ${idx === 0 ? 'active' : ''}`}
            >
              <span className="hourly-time">{formattedHour}</span>

              <div className="hourly-icon">
                <WeatherIcon name={item.iconName} size={28} color="var(--accent-color)" />
              </div>

              <span className="hourly-temp">
                {formatTemperature(item.temp, tempUnit)}
              </span>

              {item.precipProb > 0 ? (
                <div className="hourly-rain-badge">
                  <Droplet size={11} />
                  <span>{item.precipProb}%</span>
                </div>
              ) : (
                <div style={{ height: '17px' }} />
              )}

              <span className="hourly-wind">{windDisplay}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
