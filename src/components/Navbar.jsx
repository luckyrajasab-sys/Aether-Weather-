import React from 'react';
import {
  CloudSun,
  Navigation,
  Sun,
  Moon,
  Loader2,
  Share2
} from 'lucide-react';

export const Navbar = ({
  onRequestLocation,
  tempUnit,
  onToggleTempUnit,
  isDarkMode,
  onToggleDarkMode,
  isLoadingLocation,
  onOpenShare
}) => {
  return (
    <header className="navbar glass-card">
      {/* Brand */}
      <div className="brand-section" onClick={() => onRequestLocation()} title="Live Weather Dashboard">
        <div className="brand-icon">
          <CloudSun size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h1 className="brand-title">Aether</h1>
            <span className="brand-badge">PRO</span>
          </div>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="nav-actions">
        {/* Geolocation Button */}
        <button
          className="nav-btn primary"
          onClick={onRequestLocation}
          disabled={isLoadingLocation}
          title="Detect Current Location"
        >
          {isLoadingLocation ? (
            <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Navigation size={16} />
          )}
          <span>{isLoadingLocation ? 'Locating...' : 'My Location'}</span>
        </button>

        {/* Share Snapshot Button */}
        {onOpenShare && (
          <button
            className="nav-btn"
            onClick={onOpenShare}
            title="Export & Share Snapshot"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
        )}

        {/* Temperature Unit Switcher */}
        <div className="unit-switch-group">
          <button
            className={`unit-btn ${tempUnit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleTempUnit('C')}
            aria-label="Celsius"
          >
            °C
          </button>
          <button
            className={`unit-btn ${tempUnit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleTempUnit('F')}
            aria-label="Fahrenheit"
          >
            °F
          </button>
        </div>

        {/* Dark/Light Glass Toggle */}
        <button
          className="nav-btn"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Bright Glass' : 'Switch to Dark Glass'}
          style={{ width: '42px', padding: 0, justifyContent: 'center' }}
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
