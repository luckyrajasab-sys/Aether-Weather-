import React, { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Sun,
  ShieldAlert,
  X,
  Clock,
  Building2,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { getUVLevel } from '../utils/formatWeatherData';

export const WeatherAlerts = ({ alerts = [], uvIndex = 0, onDismissAlert }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [expandedAlertId, setExpandedAlertId] = useState(null);

  const uvInfo = getUVLevel(uvIndex);
  const isUVHigh = uvIndex >= 6;

  const activeAlerts = (alerts || []).filter((a) => !dismissedAlerts.includes(a.id));

  // If all dismissed and UV is not high
  if (activeAlerts.length === 0 && !isUVHigh) return null;

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setDismissedAlerts((prev) => [...prev, id]);
    if (onDismissAlert) onDismissAlert(id);
  };

  return (
    <div className={`alerts-wrapper ${isCollapsed ? 'collapsed' : ''} animate-fade-in`}>
      {/* High UV Radiation Banner if UV >= 6 and not collapsed/dismissed */}
      {isUVHigh && !dismissedAlerts.includes('uv-alert') && (
        <div className="alerts-banner uv-alert-banner">
          <div className="alerts-icon-wrap uv-pulse">
            <Sun size={22} />
          </div>
          <div className="alerts-content">
            <div className="alerts-header-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="alerts-title">High UV Radiation Advisory (Level {Math.round(uvIndex)} - {uvInfo.level})</span>
                <span className="alerts-severity" style={{ backgroundColor: uvInfo.color, color: '#000' }}>
                  {uvInfo.level}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <button
                  className="alert-toggle-btn"
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </button>
                <button
                  className="alert-toggle-btn"
                  onClick={(e) => handleDismiss('uv-alert', e)}
                  title="Dismiss UV Alert"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <>
                <p className="alerts-msg">{uvInfo.desc}. Peak midday solar intensity requires sun protection.</p>
                <div className="alert-expanded-panel" style={{ marginTop: '0.5rem' }}>
                  <p className="alerts-instruct" style={{ margin: 0 }}>
                    <strong>Safety Action:</strong> Apply SPF 50+ sunscreen, wear UV400 sunglasses, and stay hydrated in shaded areas.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Severe Weather Meteorological Alerts (Storms, Cyclonic Wind, Monsoon Flood, Heatwaves) */}
      {activeAlerts.map((alert) => {
        const isExpanded = expandedAlertId === alert.id || activeAlerts.length === 1;
        const isCritical = alert.severity === 'critical';

        return (
          <div
            key={alert.id}
            className={`alerts-banner severe-alert ${isCritical ? 'critical-alert-banner' : ''}`}
          >
            <div className="alerts-icon-wrap">
              {isCritical ? (
                <Zap size={22} className="alert-zap-anim" />
              ) : (
                <AlertTriangle size={22} />
              )}
            </div>
            <div className="alerts-content">
              <div className="alerts-header-row">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="alerts-title">{alert.title}</span>
                  {alert.badge && (
                    <span className={`alerts-severity-badge ${isCritical ? 'critical' : 'warning'}`}>
                      {alert.badge}
                    </span>
                  )}
                  {alert.agency && (
                    <span className="alerts-agency-tag">
                      <Building2 size={11} style={{ marginRight: '3px' }} />
                      {alert.agency}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <button
                    className="alert-toggle-btn"
                    onClick={() => setExpandedAlertId(isExpanded && activeAlerts.length > 1 ? null : alert.id)}
                    title={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <button
                    className="alert-toggle-btn"
                    onClick={(e) => handleDismiss(alert.id, e)}
                    title="Dismiss Alert"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>

              <p className="alerts-msg">{alert.message}</p>

              {/* Time Window Tags */}
              {(alert.effective || alert.expires) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {alert.effective && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> Issued: {alert.effective}
                    </span>
                  )}
                  {alert.expires && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      Expires: {alert.expires}
                    </span>
                  )}
                </div>
              )}

              {/* Collapsible Action Plan & Safety Guidelines */}
              {isExpanded && alert.instruction && (
                <div className="alert-expanded-panel">
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                    <ShieldAlert size={16} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p className="alerts-instruct" style={{ margin: 0 }}>
                      <strong>Emergency Action Plan:</strong> {alert.instruction}
                    </p>
                  </div>
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
