import React from 'react';
import {
  CloudSun,
  Navigation,
  Sun,
  Moon,
  Loader2,
  Share2,
  Sparkles,
  Bookmark,
  Building2,
  ChevronDown,
  Zap,
  ZapOff
} from 'lucide-react';

export const TopBar = ({
  onRequestLocation,
  tempUnit,
  onToggleTempUnit,
  isDarkMode,
  onToggleDarkMode,
  isLoadingLocation,
  onOpenShare,
  onOpenChat,
  onOpenSaved,
  onOpenMajorCities,
  isMajorCitiesOpen,
  lowPowerMode,
  onToggleLowPowerMode,
  currentLocation
}) => {
  return (
    <header className="aether-topbar glass-card">
      <div className="topbar-inner">
        {/* Left: Brand & Major Cities Button */}
        <div className="topbar-left">
          {/* Brand Logo */}
          <div
            className="topbar-brand"
            onClick={onRequestLocation}
            title="Aether Weather Pro — Click to Refresh"
          >
            <div className="topbar-brand-icon">
              <CloudSun size={22} />
            </div>
            <div className="topbar-brand-text">
              <span className="brand-name">Aether</span>
              <span className="brand-pro-tag">PRO</span>
            </div>
          </div>

          <div className="topbar-divider" />

          {/* Major Cities Trigger Button */}
          <button
            className={`topbar-major-cities-btn ${isMajorCitiesOpen ? 'active' : ''}`}
            onClick={onOpenMajorCities}
            title="Browse all Major Cities, State Capitals & Metros"
            aria-label="Open Major Cities"
          >
            <Building2 size={16} className="major-cities-icon" />
            <span className="major-cities-label">Major Cities</span>
            <ChevronDown size={14} className={`major-cities-arrow ${isMajorCitiesOpen ? 'rotate' : ''}`} />
          </button>
        </div>

        {/* Right: Actions Group */}
        <div className="topbar-right">
          {/* Geolocation / My Location */}
          <button
            className="topbar-action-btn primary"
            onClick={onRequestLocation}
            disabled={isLoadingLocation}
            title="Detect My Location (GPS / IP)"
            aria-label="Detect My Location"
          >
            {isLoadingLocation ? (
              <Loader2 size={16} className="spin-fast" />
            ) : (
              <Navigation size={16} />
            )}
            <span className="action-btn-text">{isLoadingLocation ? 'Locating...' : 'My Location'}</span>
          </button>

          {/* AI Meteorologist Chat */}
          {onOpenChat && (
            <button
              className="topbar-action-btn ai-chat-btn"
              onClick={onOpenChat}
              title="Ask Aether AI Meteorologist"
              aria-label="Open AI Meteorologist"
            >
              <Sparkles size={16} className="sparkle-anim" color="#38BDF8" />
              <span className="action-btn-text ai-label">AI Chat</span>
            </button>
          )}

          {/* Saved Locations */}
          {onOpenSaved && (
            <button
              className="topbar-action-btn"
              onClick={onOpenSaved}
              title="Saved Locations & Home City"
              aria-label="Saved Locations"
            >
              <Bookmark size={16} color="#FBBF24" />
              <span className="action-btn-text">Saved</span>
            </button>
          )}

          {/* Share Snapshot */}
          {onOpenShare && (
            <button
              className="topbar-action-btn icon-only"
              onClick={onOpenShare}
              title="Share Weather Snapshot"
              aria-label="Share Snapshot"
            >
              <Share2 size={16} />
            </button>
          )}

          {/* Temperature Unit Toggle (°C / °F) */}
          <div className="topbar-unit-toggle">
            <button
              className={`unit-toggle-pill ${tempUnit === 'C' ? 'active' : ''}`}
              onClick={() => onToggleTempUnit('C')}
              title="Celsius (°C)"
            >
              °C
            </button>
            <button
              className={`unit-toggle-pill ${tempUnit === 'F' ? 'active' : ''}`}
              onClick={() => onToggleTempUnit('F')}
              title="Fahrenheit (°F)"
            >
              °F
            </button>
          </div>

          {/* Dark / Bright Glass Toggle */}
          <button
            className="topbar-action-btn icon-only"
            onClick={onToggleDarkMode}
            title={isDarkMode ? 'Switch to Bright Glass' : 'Switch to Dark Glass'}
            aria-label="Toggle Theme"
          >
            {isDarkMode ? <Sun size={17} color="#FBBF24" /> : <Moon size={17} color="#A78BFA" />}
          </button>

          {/* Low Power Eco Mode Toggle */}
          {onToggleLowPowerMode && (
            <button
              className={`topbar-action-btn icon-only ${lowPowerMode ? 'active-eco' : ''}`}
              onClick={onToggleLowPowerMode}
              title={lowPowerMode ? 'Eco Mode: ON (High Performance)' : 'Eco Mode: OFF'}
              aria-label="Toggle Eco Mode"
            >
              {lowPowerMode ? <Zap size={16} color="#10B981" /> : <ZapOff size={16} color="var(--text-muted)" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
