import React from 'react';
import {
  CloudSun,
  Navigation,
  Sun,
  Moon,
  Loader2,
  Share2
} from 'lucide-react';

export const FloatingSideBar = ({
  onRequestLocation,
  tempUnit,
  onToggleTempUnit,
  isDarkMode,
  onToggleDarkMode,
  isLoadingLocation,
  onOpenShare
}) => {
  return (
    <aside className="flying-sidebar-dock glass-card">
      {/* Brand Icon & Popped Logo */}
      <div
        className="sidebar-brand-btn"
        onClick={() => onRequestLocation()}
        title="Aether Weather Pro"
      >
        <div className="sidebar-brand-icon">
          <CloudSun size={22} />
        </div>
        <span className="sidebar-brand-label">Aether Pro</span>
        <div className="sidebar-tooltip">Aether Pro</div>
      </div>

      <div className="sidebar-divider" />

      {/* Action Buttons Group */}
      <div className="sidebar-actions-group">
        {/* Geolocation Button */}
        <button
          className="sidebar-action-btn primary"
          onClick={onRequestLocation}
          disabled={isLoadingLocation}
          title="Detect My Location"
          aria-label="Detect Current Location"
        >
          {isLoadingLocation ? (
            <Loader2 size={18} className="spin-fast" />
          ) : (
            <Navigation size={18} />
          )}
          <div className="sidebar-tooltip">{isLoadingLocation ? 'Locating...' : 'My Location'}</div>
        </button>

        {/* Share Snapshot Button */}
        {onOpenShare && (
          <button
            className="sidebar-action-btn"
            onClick={onOpenShare}
            title="Share Snapshot"
            aria-label="Share Snapshot"
          >
            <Share2 size={18} />
            <div className="sidebar-tooltip">Share Snapshot</div>
          </button>
        )}

        {/* Temperature Unit Switcher */}
        <button
          className="sidebar-action-btn unit-toggle"
          onClick={() => onToggleTempUnit(tempUnit === 'C' ? 'F' : 'C')}
          title={`Switch to °${tempUnit === 'C' ? 'F' : 'C'}`}
          aria-label="Toggle Temperature Unit"
        >
          <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>°{tempUnit}</span>
          <div className="sidebar-tooltip">Switch to °{tempUnit === 'C' ? 'F' : 'C'}</div>
        </button>

        {/* Dark/Light Glass Mode Toggle */}
        <button
          className="sidebar-action-btn"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Bright Glass Mode' : 'Dark Glass Mode'}
          aria-label="Toggle Dark / Light Theme"
        >
          {isDarkMode ? <Sun size={18} color="#FBBF24" /> : <Moon size={18} color="#A78BFA" />}
          <div className="sidebar-tooltip">{isDarkMode ? 'Bright Glass' : 'Dark Glass'}</div>
        </button>
      </div>
    </aside>
  );
};

export default FloatingSideBar;
