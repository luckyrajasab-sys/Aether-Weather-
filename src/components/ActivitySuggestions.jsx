import React from 'react';
import {
  Compass,
  Umbrella,
  Shirt,
  Sun,
  Activity,
  Car,
  Bike,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { formatRawTemp, formatTemperature, getUVLevel } from '../utils/formatWeatherData';

export const ActivitySuggestions = ({ weather, tempUnit }) => {
  if (!weather || !weather.current) return null;

  const { current, hourly = [], airQuality = {} } = weather;
  const tempC = formatRawTemp(current.temperature, 'C');
  const rainProb = Math.max(...hourly.slice(0, 12).map((h) => h.precipProb || 0), 0);
  const isRaining = (current.precipitation || 0) > 0 || rainProb > 50;
  const uv = current.uvIndex || 0;
  const wind = current.windSpeed || 0;
  const aqi = airQuality.aqi || 35;

  // Derive Suggestions
  const suggestions = [];

  // 1. Umbrella & Rain
  if (isRaining || rainProb >= 40) {
    suggestions.push({
      id: 'rain-sug',
      icon: Umbrella,
      color: '#38BDF8',
      title: 'Carry an Umbrella',
      desc: `High precipitation chance (${rainProb}%). Keep waterproof outer layers handy.`,
      status: 'caution'
    });
  } else {
    suggestions.push({
      id: 'rain-sug',
      icon: Umbrella,
      color: '#10B981',
      title: 'No Umbrella Needed',
      desc: `Low rain probability (${rainProb}%). Dry atmospheric conditions.`,
      status: 'good'
    });
  }

  // 2. Outdoor Workouts & Cycling
  if (isRaining || wind > 45 || tempC > 35 || aqi > 120) {
    suggestions.push({
      id: 'workout-sug',
      icon: Bike,
      color: '#F59E0B',
      title: 'Indoor Exercise Recommended',
      desc: isRaining ? 'Wet pavement and low visibility.' : wind > 45 ? 'Strong gusty winds.' : 'Elevated thermal or air index.',
      status: 'caution'
    });
  } else {
    suggestions.push({
      id: 'workout-sug',
      icon: Activity,
      color: '#10B981',
      title: 'Great for Outdoor Sports',
      desc: `Pleasant ${formatTemperature(current.temperature, tempUnit)} air with moderate ${Math.round(wind)} km/h breeze.`,
      status: 'good'
    });
  }

  // 3. Clothing & Layering
  let clothingDesc = '';
  if (tempC >= 28) clothingDesc = 'Light cotton/linen shirt, shorts, and breathable fabrics.';
  else if (tempC >= 18) clothingDesc = 'Casual t-shirt with light pants or a light overshirt.';
  else if (tempC >= 10) clothingDesc = 'Comfortable sweater or windbreaker jacket.';
  else clothingDesc = 'Heavy insulated coat, thermal layers, and warm scarf.';

  suggestions.push({
    id: 'outfit-sug',
    icon: Shirt,
    color: '#A855F7',
    title: 'Smart Outfit Advice',
    desc: clothingDesc,
    status: 'neutral'
  });

  // 4. Sun & UV Protection
  if (uv >= 6) {
    suggestions.push({
      id: 'uv-sug',
      icon: Sun,
      color: '#EF4444',
      title: 'High Sun Exposure (SPF 50+)',
      desc: 'Apply sunscreen, wear UV400 sunglasses, and stay in shade midday.',
      status: 'warning'
    });
  } else {
    suggestions.push({
      id: 'uv-sug',
      icon: Sun,
      color: '#38BDF8',
      title: 'Gentle Solar Intensity',
      desc: 'Safe for daylight outdoor strolls with standard skin comfort.',
      status: 'good'
    });
  }

  return (
    <div className="glass-card activity-suggestions-card animate-fade-in">
      <div className="section-title-row">
        <h3 className="section-title">
          <Sparkles size={20} color="var(--primary-color)" />
          <span>Practical Daily Activity & Outfit Insights</span>
        </h3>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Real-time Atmospheric Guidance
        </span>
      </div>

      <div className="suggestions-grid">
        {suggestions.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="suggestion-item-box">
              <div className="suggestion-icon-badge" style={{ background: `rgba(255, 255, 255, 0.1)`, color: item.color, border: `1px solid ${item.color}40` }}>
                <Icon size={20} />
              </div>
              <div className="suggestion-text-col">
                <span className="suggestion-title">{item.title}</span>
                <span className="suggestion-desc">{item.desc}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySuggestions;
