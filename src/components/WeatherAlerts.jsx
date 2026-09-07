import React, { useState, useEffect } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Sun, ShieldAlert, X } from 'lucide-react';
import { getUVLevel } from '../utils/formatWeatherData';

export const WeatherAlerts = ({ alerts = [], uvIndex = 0 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [expandedAlertId, setExpandedAlertId] = useState(null);

  // Auto-collapse to slim strip on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isCollapsed]);

  const uvInfo = getUVLevel(uvIndex);
  const isUVHigh = uvIndex >= 6;

  // If no alerts and UV is not high, or user dismissed
  if ((!alerts || alerts.length === 0) && !isUVHigh) return null;
  if (isDismissed) return null;

  return (
    <div className={`alerts-wrapper ${isCollapsed ? 'collapsed' : ''}`}>
      {/* UV Alert Banner if UV >= 6 */}
      {isUVHigh && (
        <div className="alerts-banner uv-alert-banner">
          <div className="alerts-icon-wrap uv-pulse">
            <Sun size={22} />
          </div>
          <div className="alerts-content">
            <div className="alerts-header-row">
              <span className="alerts-title">High UV Radiation Alert (Level {Math.round(uvIndex)} - {uvInfo.level})</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="alerts-severity" style={{ backgroundColor: uvInfo.color }}>
                  {uvInfo.level}
                </span>
                <button
                  className="alert-toggle-btn"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <>
                <p className="alerts-msg">{uvInfo.desc}. Peak midday solar intensity requires sun safety precautions.</p>
                <p className="alerts-instruct">Recommendation: Apply SPF 50+ sunscreen every 2h, wear UV sunglasses, and stay in shade.</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Severe Weather Meteorological Alerts (Storms, High Wind, Extreme Heat, Floods) */}
      {alerts.map((alert) => {
        const isExpanded = expandedAlertId === alert.id;
        return (
          <div key={alert.id} className="alerts-banner severe-alert">
            <div className="alerts-icon-wrap">
              <AlertTriangle size={22} />
            </div>
            <div className="alerts-content">
              <div className="alerts-header-row">
                <span className="alerts-title">{alert.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="alerts-severity">{alert.severity}</span>
                  <button
                    className="alert-toggle-btn"
                    onClick={() => setExpandedAlertId(isExpanded ? null : alert.id)}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              <p className="alerts-msg">{alert.message}</p>

              {isExpanded && alert.instruction && (
                <div className="alert-expanded-panel">
                  <p className="alerts-instruct"><strong>Action Plan:</strong> {alert.instruction}</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherAlerts;
