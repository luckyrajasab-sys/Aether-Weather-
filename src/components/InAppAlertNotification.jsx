import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, X, ChevronRight, ShieldAlert, Zap } from 'lucide-react';

export const InAppAlertNotification = ({ alerts = [], onOpenAlertsView }) => {
  const [visible, setVisible] = useState(false);
  const [dismissedAlertIds, setDismissedAlertIds] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('dismissed_alert_toasts') || '[]');
    } catch {
      return [];
    }
  });

  const activeAlert = alerts.find(
    (a) => (a.severity === 'critical' || a.severity === 'high') && !dismissedAlertIds.includes(a.id)
  );

  useEffect(() => {
    if (activeAlert) {
      // Small timeout to animate in smoothly
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [activeAlert]);

  if (!activeAlert || !visible) return null;

  const handleDismiss = (e) => {
    e.stopPropagation();
    setVisible(false);
    const updated = [...dismissedAlertIds, activeAlert.id];
    setDismissedAlertIds(updated);
    try {
      sessionStorage.setItem('dismissed_alert_toasts', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const isCritical = activeAlert.severity === 'critical';

  return (
    <div className={`in-app-push-toast ${isCritical ? 'critical' : 'warning'}`}>
      <div className="toast-inner" onClick={onOpenAlertsView}>
        <div className="toast-icon-wrapper">
          {isCritical ? (
            <Zap size={18} className="toast-pulse-icon" />
          ) : (
            <AlertTriangle size={18} />
          )}
        </div>

        <div className="toast-text-block">
          <div className="toast-title-row">
            <span className="toast-badge">{activeAlert.badge || 'ALERT'}</span>
            <span className="toast-title">{activeAlert.title}</span>
          </div>
          <p className="toast-msg">{activeAlert.message}</p>
        </div>

        <div className="toast-actions">
          {onOpenAlertsView && (
            <button className="toast-action-btn" onClick={onOpenAlertsView} title="View Action Plan">
              <span>Action Plan</span>
              <ChevronRight size={14} />
            </button>
          )}
          <button className="toast-close-btn" onClick={handleDismiss} title="Dismiss Notification">
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InAppAlertNotification;
