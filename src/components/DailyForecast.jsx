import React, { useState } from 'react';
import {
  Calendar,
  Droplet,
  Wind,
  ChevronDown,
  ChevronUp,
  LayoutList,
  CalendarDays,
  Sun,
  Sunrise,
  Sunset,
  Sparkles,
  X
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import AnimatedNumber from './AnimatedNumber';
import TiltCard from './TiltCard';
import {
  formatTemperature,
  getDayName,
  formatDate,
  formatRawTemp,
  kmhToMph
} from '../utils/formatWeatherData';

export const DailyForecast = ({ daily = [], tempUnit, timezone }) => {
  const [isExtended, setIsExtended] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'calendar'
  const [selectedDay, setSelectedDay] = useState(null);

  if (!daily || daily.length === 0) return null;

  // 7 days vs 14+ days extended
  const currentList = isExtended ? daily : daily.slice(0, 7);

  // Compute absolute min & max temperatures for visual range bar
  const allMins = currentList.map((d) => d.minTemp ?? 0);
  const allMaxs = currentList.map((d) => d.maxTemp ?? 0);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const rangeSpan = Math.max(1, globalMax - globalMin);

  return (
    <TiltCard className="forecast-card-container animate-fade-in" maxTilt={2}>
      <div className="section-title-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calendar size={22} color="var(--primary-color)" />
          <div>
            <h3 className="section-title" style={{ margin: 0 }}>
              <span>{isExtended ? '14-Day Extended' : '7-Day'} Forecast</span>
            </h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {viewMode === 'calendar' ? 'Interactive Weather Calendar' : 'Meteorological Trajectory'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {/* View Mode Toggle: List vs Calendar */}
          <div className="forecast-tabs">
            <button
              className={`forecast-tab-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List View"
            >
              <LayoutList size={14} style={{ display: 'inline', marginRight: '4px' }} />
              List
            </button>
            <button
              className={`forecast-tab-btn ${viewMode === 'calendar' ? 'active' : ''}`}
              onClick={() => setViewMode('calendar')}
              title="Calendar View"
            >
              <CalendarDays size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Calendar
            </button>
          </div>

          {/* Extend 7/14 Days Button */}
          <button
            className={`extend-forecast-btn ${isExtended ? 'active' : ''}`}
            onClick={() => setIsExtended(!isExtended)}
            title={isExtended ? 'Show 7 Days' : 'Extend to 14 Days'}
          >
            <span>{isExtended ? 'Collapse to 7 Days' : 'Extend 14 Days'}</span>
            {isExtended ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* VIEW 1: Standard List View */}
      {viewMode === 'list' && (
        <div className="daily-forecast-list">
          {currentList.map((day, idx) => {
            const isToday = idx === 0;
            const dayTitle = getDayName(day.date, timezone, isToday);
            const dateSub = formatDate(day.date, timezone);

            const leftPercent = Math.max(0, Math.min(100, ((day.minTemp - globalMin) / rangeSpan) * 100));
            const rightPercent = Math.max(0, Math.min(100, ((day.maxTemp - globalMin) / rangeSpan) * 100));
            const widthPercent = Math.max(12, rightPercent - leftPercent);

            const windDisplay = tempUnit === 'F' ? `${kmhToMph(day.windSpeedMax)} mph` : `${Math.round(day.windSpeedMax)} km/h`;

            return (
              <div
                key={`day-${day.date}-${idx}`}
                className={`daily-forecast-row ${selectedDay?.date === day.date ? 'selected-row' : ''}`}
                style={{ animationDelay: `${idx * 30}ms` }}
                onClick={() => setSelectedDay(day)}
                title="Click for full day telemetry"
              >
                {/* Day & Date */}
                <div className="daily-day-info">
                  <span className="daily-day-name">{dayTitle}</span>
                  <span className="daily-date-sub">{dateSub.split(',')[1] || dateSub}</span>
                </div>

                {/* Condition & Icon */}
                <div className="daily-condition-wrap">
                  <WeatherIcon name={day.iconName} size={24} color="var(--accent-color)" />
                  <span className="daily-condition-label">{day.condition}</span>
                </div>

                {/* Apple-style Min/Max Temperature Visual Bar */}
                <div className="daily-bar-container">
                  <span className="daily-temp-min">
                    <AnimatedNumber value={formatRawTemp(day.minTemp, tempUnit)} />°
                  </span>
                  <div className="daily-temp-bar-track">
                    <div
                      className="daily-temp-bar-fill"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`
                      }}
                    />
                  </div>
                  <span className="daily-temp-max">
                    <AnimatedNumber value={formatRawTemp(day.maxTemp, tempUnit)} />°
                  </span>
                </div>

                {/* Rain & Wind Stats */}
                <div className="daily-extra-stats">
                  {day.rainProb > 0 ? (
                    <span className="daily-rain-stat">
                      <Droplet size={12} />
                      {day.rainProb}%
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-dim)' }}>0%</span>
                  )}
                  <span className="daily-wind-stat">{windDisplay}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: Interactive Weather Calendar Matrix */}
      {viewMode === 'calendar' && (
        <div className="weather-calendar-grid">
          {currentList.map((day, idx) => {
            const isToday = idx === 0;
            const dateObj = new Date(day.date);
            const dayNum = dateObj.getDate();
            const monthName = dateObj.toLocaleDateString([], { month: 'short' });
            const weekdayName = getDayName(day.date, timezone, isToday);

            const isSelected = selectedDay?.date === day.date;

            return (
              <div
                key={`cal-day-${day.date}-${idx}`}
                className={`weather-calendar-cell ${isToday ? 'today-cell' : ''} ${isSelected ? 'selected-cell' : ''}`}
                onClick={() => setSelectedDay(day)}
                title={`View forecast details for ${weekdayName}, ${monthName} ${dayNum}`}
              >
                <div className="calendar-cell-top">
                  <span className="calendar-weekday">{weekdayName}</span>
                  <span className={`calendar-day-badge ${isToday ? 'today-badge' : ''}`}>
                    {dayNum} {monthName}
                  </span>
                </div>

                <div className="calendar-cell-icon-wrap">
                  <WeatherIcon name={day.iconName} size={30} color="var(--accent-color)" />
                  <span className="calendar-condition-text">{day.condition}</span>
                </div>

                <div className="calendar-cell-temps">
                  <span className="cal-high">{formatRawTemp(day.maxTemp, tempUnit)}°</span>
                  <span className="cal-divider">/</span>
                  <span className="cal-low">{formatRawTemp(day.minTemp, tempUnit)}°</span>
                </div>

                {day.rainProb > 0 && (
                  <div className="calendar-rain-pill">
                    <Droplet size={11} />
                    <span>{day.rainProb}% rain</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Day Telemetry Modal / Popover */}
      {selectedDay && (
        <div className="selected-day-modal-backdrop" onClick={() => setSelectedDay(null)}>
          <div className="selected-day-modal glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <WeatherIcon name={selectedDay.iconName} size={28} color="var(--accent-color)" />
                <div>
                  <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                    {getDayName(selectedDay.date, timezone, false)}, {formatDate(selectedDay.date, timezone)}
                  </h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {selectedDay.condition}
                  </span>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedDay(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="selected-day-metrics-grid">
              <div className="day-metric-tile">
                <span className="day-metric-label">High / Low Temp</span>
                <span className="day-metric-val">
                  {formatRawTemp(selectedDay.maxTemp, tempUnit)}° / {formatRawTemp(selectedDay.minTemp, tempUnit)}°{tempUnit}
                </span>
              </div>

              <div className="day-metric-tile">
                <span className="day-metric-label">Precipitation Chance</span>
                <span className="day-metric-val" style={{ color: '#38BDF8' }}>
                  {selectedDay.rainProb || 0}%
                </span>
              </div>

              <div className="day-metric-tile">
                <span className="day-metric-label">Max Wind Gusts</span>
                <span className="day-metric-val">
                  {tempUnit === 'F' ? `${kmhToMph(selectedDay.windSpeedMax)} mph` : `${Math.round(selectedDay.windSpeedMax)} km/h`}
                </span>
              </div>

              <div className="day-metric-tile">
                <span className="day-metric-label">UV Radiation Index</span>
                <span className="day-metric-val" style={{ color: selectedDay.uvIndexMax > 7 ? '#EF4444' : '#10B981' }}>
                  {selectedDay.uvIndexMax || 6} (Max)
                </span>
              </div>

              {selectedDay.sunrise && (
                <div className="day-metric-tile">
                  <span className="day-metric-label">Sunrise Time</span>
                  <span className="day-metric-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sunrise size={14} color="#F59E0B" />
                    {new Date(selectedDay.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}

              {selectedDay.sunset && (
                <div className="day-metric-tile">
                  <span className="day-metric-label">Sunset Time</span>
                  <span className="day-metric-val" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sunset size={14} color="#F97316" />
                    {new Date(selectedDay.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </TiltCard>
  );
};

export default DailyForecast;
