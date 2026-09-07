import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  LineChart as LineChartIcon,
  Thermometer,
  CloudRain,
  Droplets,
  Wind,
  Gauge,
  Sparkles
} from 'lucide-react';
import { formatTime, formatRawTemp, kmhToMph } from '../utils/formatWeatherData';

const CustomGlassTooltip = ({ active, payload, label, unit = '' }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '14px',
          padding: '0.85rem 1.1rem',
          boxShadow: '0 14px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 255, 255, 0.1)',
          color: '#fff',
          fontSize: '0.88rem',
          pointerEvents: 'none',
          animation: 'dropdownSlide 0.15s ease-out'
        }}
      >
        <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.4rem' }}>
          {label}
        </div>
        {payload.map((item, i) => (
          <div key={`tip-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, margin: '0.2rem 0' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: item.color || '#38BDF8', boxShadow: `0 0 8px ${item.color}` }} />
            <span style={{ color: 'rgba(255,255,255,0.9)' }}>{item.name}:</span>
            <span style={{ color: '#fff', fontWeight: 800 }}>{item.value} {unit}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const WeatherAnalytics = ({ hourly = [], tempUnit, timezone }) => {
  const [activeTab, setActiveTab] = useState('wind');

  if (!hourly || hourly.length === 0) return null;

  // Prepare chart dataset for the next 24 hours
  const chartData = hourly.slice(0, 24).map((h, i) => ({
    timeStr: i === 0 ? 'Now' : formatTime(h.time, timezone),
    rawTemp: formatRawTemp(h.temp, tempUnit),
    feelsLike: formatRawTemp(h.apparentTemp, tempUnit),
    precipProb: h.precipProb,
    precipitation: h.precipitation,
    humidity: Math.round(h.humidity),
    windSpeed: tempUnit === 'F' ? kmhToMph(h.windSpeed) : Math.round(h.windSpeed),
    windGusts: tempUnit === 'F' ? kmhToMph(h.windGusts) : Math.round(h.windGusts),
    pressure: Math.round(h.pressure)
  }));

  const tabs = [
    { id: 'wind', label: 'Wind & Gusts', icon: Wind, color: '#38BDF8' },
    { id: 'temperature', label: 'Temperature', icon: Thermometer, color: '#F59E0B' },
    { id: 'rain', label: 'Precipitation', icon: CloudRain, color: '#00E5FF' },
    { id: 'humidity', label: 'Humidity', icon: Droplets, color: '#10B981' },
    { id: 'pressure', label: 'Pressure', icon: Gauge, color: '#A78BFA' }
  ];

  return (
    <div className="glass-card analytics-card-container">
      <div className="section-title-row">
        <h3 className="section-title">
          <LineChartIcon size={20} color="var(--primary-color)" />
          <span>Weather Analytics & Telemetry</span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Real-time 24-Hour Telemetry
        </span>
      </div>

      {/* Analytics Tabs */}
      <div className="analytics-tab-bar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              className={`analytics-tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chart Legend Badges for Wind */}
      {activeTab === 'wind' && (
        <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1rem', padding: '0.4rem 0.6rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 600, color: '#38BDF8' }}>
            <span style={{ width: '12px', height: '4px', borderRadius: '2px', background: '#38BDF8', boxShadow: '0 0 8px #38BDF8' }} />
            <span>Sustained Wind Speed</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: 600, color: '#F43F5E' }}>
            <span style={{ width: '12px', height: '4px', borderRadius: '2px', background: '#F43F5E', boxShadow: '0 0 8px #F43F5E' }} />
            <span>Peak Wind Gusts</span>
          </div>
        </div>
      )}

      {/* Smooth Chart Canvas Area with High-Contrast Vivid Colors */}
      <div className="chart-wrapper" key={activeTab}>
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'wind' && (
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284C7" stopOpacity={0.65} />
                  <stop offset="95%" stopColor="#38BDF8" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="gustGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" vertical={false} />
              <XAxis dataKey="timeStr" stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} />
              <YAxis stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} unit={tempUnit === 'F' ? ' mph' : ' km/h'} />
              <Tooltip content={<CustomGlassTooltip unit={tempUnit === 'F' ? 'mph' : 'km/h'} />} />
              <Area
                type="monotone"
                dataKey="windSpeed"
                name="Sustained Wind"
                stroke="#38BDF8"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#windGradient)"
                activeDot={{ r: 7, fill: '#38BDF8', stroke: '#FFFFFF', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
              <Line
                type="monotone"
                dataKey="windGusts"
                name="Peak Gusts"
                stroke="#F43F5E"
                strokeWidth={3}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#F43F5E', stroke: '#fff', strokeWidth: 1 }}
                activeDot={{ r: 7, fill: '#F43F5E', stroke: '#FFFFFF', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={600}
              />
            </AreaChart>
          )}

          {activeTab === 'temperature' && (
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" vertical={false} />
              <XAxis dataKey="timeStr" stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} />
              <YAxis stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} unit={`°`} domain={['dataMin - 2', 'dataMax + 2']} />
              <Tooltip content={<CustomGlassTooltip unit={`°${tempUnit}`} />} />
              <Area
                type="monotone"
                dataKey="rawTemp"
                name="Temperature"
                stroke="#FBBF24"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#tempGradient)"
                activeDot={{ r: 7, fill: '#FBBF24', stroke: '#FFFFFF', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
              <Area
                type="monotone"
                dataKey="feelsLike"
                name="Feels Like"
                stroke="#FFFFFF"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="none"
                isAnimationActive={true}
                animationDuration={600}
              />
            </AreaChart>
          )}

          {activeTab === 'rain' && (
            <BarChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" vertical={false} />
              <XAxis dataKey="timeStr" stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} />
              <YAxis stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomGlassTooltip unit="%" />} />
              <Bar
                dataKey="precipProb"
                name="Rain Chance"
                fill="#00E5FF"
                radius={[8, 8, 0, 0]}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </BarChart>
          )}

          {activeTab === 'humidity' && (
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.55} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" vertical={false} />
              <XAxis dataKey="timeStr" stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} />
              <YAxis stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} unit="%" domain={[0, 100]} />
              <Tooltip content={<CustomGlassTooltip unit="%" />} />
              <Area
                type="monotone"
                dataKey="humidity"
                name="Humidity"
                stroke="#10B981"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#humidityGradient)"
                activeDot={{ r: 7, fill: '#10B981', stroke: '#FFFFFF', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </AreaChart>
          )}

          {activeTab === 'pressure' && (
            <AreaChart data={chartData} margin={{ top: 15, right: 15, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="pressureGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A78BFA" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#A78BFA" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.14)" vertical={false} />
              <XAxis dataKey="timeStr" stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} />
              <YAxis stroke="rgba(255,255,255,0.75)" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.85)' }} domain={['dataMin - 3', 'dataMax + 3']} unit=" hPa" />
              <Tooltip content={<CustomGlassTooltip unit="hPa" />} />
              <Area
                type="monotone"
                dataKey="pressure"
                name="Barometer Pressure"
                stroke="#A78BFA"
                strokeWidth={3.5}
                fillOpacity={1}
                fill="url(#pressureGradient)"
                activeDot={{ r: 7, fill: '#A78BFA', stroke: '#FFFFFF', strokeWidth: 3 }}
                isAnimationActive={true}
                animationDuration={600}
                animationEasing="ease-out"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherAnalytics;
