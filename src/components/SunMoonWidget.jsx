import React from 'react';
import { Sunrise, Sunset, Moon, Sparkles, Sun } from 'lucide-react';
import { formatTime } from '../utils/formatWeatherData';

/**
 * Calculates current Moon Phase and Illumination Percentage
 */
const getMoonPhaseData = (date = new Date()) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  let c = 0;
  let e = 0;
  let jd = 0;
  let b = 0;

  if (month < 3) {
    year - 1;
    month + 12;
  }

  // Known reference new moon
  const knownNewMoon = new Date('2000-01-06T18:14:00Z').getTime();
  const diffDays = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
  const lunarCycle = 29.53058867;
  const phase = ((diffDays % lunarCycle) + lunarCycle) % lunarCycle;
  const normalizedPhase = phase / lunarCycle;

  // Illumination percentage
  const illumination = Math.round(((1 - Math.cos(normalizedPhase * 2 * Math.PI)) / 2) * 100);

  let phaseName = 'New Moon';
  if (normalizedPhase >= 0.03 && normalizedPhase < 0.22) phaseName = 'Waxing Crescent';
  else if (normalizedPhase >= 0.22 && normalizedPhase < 0.28) phaseName = 'First Quarter';
  else if (normalizedPhase >= 0.28 && normalizedPhase < 0.47) phaseName = 'Waxing Gibbous';
  else if (normalizedPhase >= 0.47 && normalizedPhase < 0.53) phaseName = 'Full Moon';
  else if (normalizedPhase >= 0.53 && normalizedPhase < 0.72) phaseName = 'Waning Gibbous';
  else if (normalizedPhase >= 0.72 && normalizedPhase < 0.78) phaseName = 'Last Quarter';
  else if (normalizedPhase >= 0.78 && normalizedPhase < 0.97) phaseName = 'Waning Crescent';

  return {
    phase: normalizedPhase,
    phaseName,
    illumination,
    ageDays: Math.round(phase * 10) / 10
  };
};

export const SunMoonWidget = ({ weather }) => {
  const { current = {}, timezone } = weather || {};
  const sunriseStr = formatTime(current.sunrise, timezone);
  const sunsetStr = formatTime(current.sunset, timezone);

  // Calculate sun position % along the arc
  let sunProgress = 50;
  try {
    if (current.sunrise && current.sunset) {
      const nowMs = Date.now();
      const srMs = new Date(current.sunrise).getTime();
      const ssMs = new Date(current.sunset).getTime();
      if (nowMs < srMs) sunProgress = 0;
      else if (nowMs > ssMs) sunProgress = 100;
      else sunProgress = Math.max(0, Math.min(100, ((nowMs - srMs) / (ssMs - srMs)) * 100));
    }
  } catch (e) {
    sunProgress = 50;
  }

  const moonData = getMoonPhaseData(new Date());

  return (
    <div className="glass-card detail-card sun-moon-card animate-fade-in">
      <div>
        <div className="detail-header">
          <span className="detail-title">
            <Sunrise size={18} color="#FBBF24" />
            Solar & Lunar Cycle
          </span>
          <span style={{ fontSize: '0.78rem', color: '#A78BFA', fontWeight: 600 }}>
            {moonData.phaseName}
          </span>
        </div>

        {/* Solar Arc */}
        <div className="sun-arc-wrap">
          <svg className="sun-arc-svg" viewBox="0 0 200 65">
            <defs>
              <linearGradient id="sunArcGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#FBBF24" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#F97316" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <path
              d="M 10 52 Q 100 8 190 52"
              fill="none"
              stroke="url(#sunArcGrad)"
              strokeWidth="2.5"
              strokeDasharray="4 3"
            />
            <line x1="0" y1="52" x2="200" y2="52" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
            {/* Animated Sun Marker on Arc */}
            <circle
              cx={10 + (180 * sunProgress) / 100}
              cy={52 - Math.sin((Math.PI * sunProgress) / 100) * 44}
              r="6.5"
              fill="#FBBF24"
              stroke="#FFFFFF"
              strokeWidth="2"
              filter="drop-shadow(0 0 6px #FBBF24)"
            />
          </svg>

          <div className="sun-times-row">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sunrise size={16} color="#FBBF24" />
              <span>{sunriseStr}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sunset size={16} color="#F97316" />
              <span>{sunsetStr}</span>
            </div>
          </div>
        </div>

        {/* Moon Phase Details Strip */}
        <div className="moon-phase-strip">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="moon-icon-badge">
              <Moon size={16} color="#C4B5FD" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fff' }}>{moonData.phaseName}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lunar Age: {moonData.ageDays} days</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#A78BFA' }}>{moonData.illumination}%</span>
            <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-dim)' }}>Illumination</span>
          </div>
        </div>
      </div>

      <div className="detail-footer-desc">
        <span>{current.isDay ? `Sun is ${Math.round(sunProgress)}% through daytime cycle.` : `Night sky illuminated by ${moonData.phaseName.toLowerCase()} (${moonData.illumination}%).`}</span>
      </div>
    </div>
  );
};

export default SunMoonWidget;
