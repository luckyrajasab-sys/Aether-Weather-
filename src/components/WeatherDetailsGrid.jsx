import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge
} from 'lucide-react';
import {
  formatTemperature,
  formatWindSpeed,
  getWindDirection,
  getUVLevel,
  kmhToMph
} from '../utils/formatWeatherData';
import SunMoonWidget from './SunMoonWidget';

export const WeatherDetailsGrid = ({ weather, tempUnit }) => {
  const { current, timezone } = weather;

  // 1. Humidity assessment
  const humidity = current.humidity ?? 50;
  const humidityDesc =
    humidity < 30 ? 'Dry and crisp air' : humidity <= 60 ? 'Comfortable humidity level' : 'Humid and muggy';

  // 2. Wind details
  const windDirName = getWindDirection(current.windDirection);
  const windAngle = current.windDirection ?? 0;
  const windGustVal = tempUnit === 'F' ? `${kmhToMph(current.windGusts)} mph` : `${Math.round(current.windGusts)} km/h`;

  // 3. UV assessment
  const uvInfo = getUVLevel(current.uvIndex);
  const uvPercentage = Math.min(100, (current.uvIndex / 12) * 100);

  // 4. Visibility assessment
  const visKm = current.visibility ?? 10;
  const visMiles = Math.round(visKm * 0.621371 * 10) / 10;
  const visDisplay = tempUnit === 'F' ? `${visMiles} mi` : `${Math.round(visKm)} km`;
  const visDesc =
    visKm >= 10 ? 'Perfectly clear visibility' : visKm >= 5 ? 'Good visibility' : 'Haze or mist reducing visibility';

  // 5. Pressure
  const pressureHpa = Math.round(current.pressure);
  const pressureInHg = (pressureHpa * 0.02953).toFixed(2);
  const pressureDesc =
    pressureHpa > 1020 ? 'High pressure system (Fair weather)' : pressureHpa < 1005 ? 'Low pressure system (Unsettled)' : 'Normal barometric pressure';

  return (
    <div className="details-grid animate-fade-in">
      {/* 1. Humidity Card */}
      <div className="glass-card detail-card">
        <div>
          <div className="detail-header">
            <span className="detail-title">
              <Droplets size={18} color="var(--primary-color)" />
              Humidity
            </span>
          </div>
          <div className="detail-value-main">{Math.round(humidity)}%</div>
          <div className="progress-bar-generic">
            <div
              className="progress-bar-generic-fill"
              style={{ width: `${Math.min(100, humidity)}%` }}
            />
          </div>
        </div>
        <div className="detail-footer-desc">
          <span>The dew point is {formatTemperature(current.dewPoint, tempUnit)}. {humidityDesc}.</span>
        </div>
      </div>

      {/* 2. Wind & Compass Card */}
      <div className="glass-card detail-card">
        <div>
          <div className="detail-header">
            <span className="detail-title">
              <Wind size={18} color="var(--primary-color)" />
              Wind Telemetry
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {windDirName} ({windAngle}°)
            </span>
          </div>
          <div className="compass-wrap">
            <div className="compass-dial">
              <span className="compass-cardinal-n">N</span>
              <div
                className="compass-needle"
                style={{ transform: `rotate(${windAngle}deg)` }}
              />
              <div className="compass-center-dot" />
            </div>
            <div>
              <div className="detail-value-main">
                {formatWindSpeed(current.windSpeed, tempUnit)}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                Gusts up to {windGustVal}
              </div>
            </div>
          </div>
        </div>
        <div className="detail-footer-desc">
          <span>Blowing towards {windDirName} at steady velocity.</span>
        </div>
      </div>

      {/* 3. UV Index Card */}
      <div className="glass-card detail-card">
        <div>
          <div className="detail-header">
            <span className="detail-title">
              <Sun size={18} color="var(--accent-color)" />
              UV Radiation
            </span>
            <span
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: uvInfo.color,
                background: 'rgba(255,255,255,0.08)',
                padding: '0.2rem 0.55rem',
                borderRadius: '8px'
              }}
            >
              {uvInfo.level}
            </span>
          </div>
          <div className="detail-value-main">{Math.round(current.uvIndex)}</div>
          <div className="uv-meter-bar">
            <div className="uv-indicator-dot" style={{ left: `${uvPercentage}%` }} />
          </div>
        </div>
        <div className="detail-footer-desc">
          <span>{uvInfo.desc}.</span>
        </div>
      </div>

      {/* 4. Visibility Card */}
      <div className="glass-card detail-card">
        <div>
          <div className="detail-header">
            <span className="detail-title">
              <Eye size={18} color="var(--primary-color)" />
              Atmospheric Visibility
            </span>
          </div>
          <div className="detail-value-main">{visDisplay}</div>
          <div className="progress-bar-generic">
            <div
              className="progress-bar-generic-fill"
              style={{ width: `${Math.min(100, (visKm / 15) * 100)}%` }}
            />
          </div>
        </div>
        <div className="detail-footer-desc">
          <span>{visDesc}.</span>
        </div>
      </div>

      {/* 5. Pressure Card */}
      <div className="glass-card detail-card">
        <div>
          <div className="detail-header">
            <span className="detail-title">
              <Gauge size={18} color="var(--primary-color)" />
              Barometer Pressure
            </span>
          </div>
          <div className="detail-value-main">{pressureHpa} <span style={{ fontSize: '1rem', fontWeight: 600 }}>hPa</span></div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
            {pressureInHg} inHg
          </div>
        </div>
        <div className="detail-footer-desc">
          <span>{pressureDesc}.</span>
        </div>
      </div>

      {/* 6. Sunrise, Sunset & Moon Phase Widget */}
      <SunMoonWidget weather={weather} />
    </div>
  );
};

export default WeatherDetailsGrid;
