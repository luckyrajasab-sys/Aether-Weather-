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
  Zap,
  ZapOff,
  Radio
} from 'lucide-react';

export const Navbar = ({
  location,
  onRequestLocation,
  tempUnit,
  onToggleTempUnit,
  isDarkMode,
  onToggleDarkMode,
  isLoadingLocation,
  onOpenShare,
  onOpenChat,
  onOpenSaved,
  lowPowerMode,
  onToggleLowPowerMode,
  savedCount = 0
}) => {
  return (
    <header className="aether-topbar glass-card animate-fade-in">
      {/* Brand Logo & Name */}
      <div
        className="topbar-brand"
        onClick={() => onRequestLocation()}
        title="Aether Weather Pro — Click to Refresh Current Location"
      >
        <div className="topbar-logo-wrap">
          <CloudSun size={24} className="topbar-logo-icon" />
          <span className="topbar-logo-glow" />
        </div>
        <div className="topbar-brand-text">
          <div className="topbar-title-row">
            <span className="topbar-brand-name">Aether</span>
            <span className="topbar-pro-badge">PRO</span>
          </div>
          <div className="topbar-status-row">
            <span className="topbar-pulse-dot" />
            <span className="topbar-status-text">
              {location?.name || 'Live Weather'}
            </span>
          </div>
        </div>
      </div>

      {/* Center / Quick Nav Actions */}
      <div className="topbar-actions">
        {/* GPS Location Button */}
        <button
          className="topbar-btn primary"
          onClick={onRequestLocation}
          disabled={isLoadingLocation}
          title="Detect Current Location"
          aria-label="Detect Current Location"
        >
          {isLoadingLocation ? (
            <Loader2 size={16} className="spin-fast" />
          ) : (
            <Navigation size={16} />
          )}
          <span className="topbar-btn-label">{isLoadingLocation ? 'Locating...' : 'My Location'}</span>
        </button>

        {/* Saved Cities Button */}
        {onOpenSaved && (
          <button
            className="topbar-btn"
            onClick={onOpenSaved}
            title="Saved Locations & Home City"
            aria-label="Saved Locations"
          >
            <Bookmark size={16} color="#FBBF24" />
            <span className="topbar-btn-label">Saved</span>
            {savedCount > 0 && (
              <span className="topbar-counter-pill">{savedCount}</span>
            )}
          </button>
        )}

        {/* AI Meteorologist Chat Button */}
        {onOpenChat && (
          <button
            className="topbar-btn ai-chat-btn"
            onClick={onOpenChat}
            title="Ask Aether AI Meteorologist"
            aria-label="Open AI Meteorologist"
          >
            <Sparkles size={16} className="sparkle-anim" color="#38BDF8" />
            <span className="topbar-btn-label">AI Chat</span>
          </button>
        )}

        {/* Share Snapshot Button */}
        {onOpenShare && (
          <button
            className="topbar-btn icon-only"
            onClick={onOpenShare}
            title="Export & Share Snapshot"
            aria-label="Share Snapshot"
          >
            <Share2 size={16} />
          </button>
        )}

        {/* Temperature Unit Switcher */}
        <div className="topbar-unit-switch" title="Toggle Temperature Unit">
          <button
            className={`topbar-unit-btn ${tempUnit === 'C' ? 'active' : ''}`}
            onClick={() => onToggleTempUnit('C')}
            aria-label="Celsius"
          >
            °C
          </button>
          <button
            className={`topbar-unit-btn ${tempUnit === 'F' ? 'active' : ''}`}
            onClick={() => onToggleTempUnit('F')}
            aria-label="Fahrenheit"
          >
            °F
          </button>
        </div>

        {/* Dark/Light Glass Mode Toggle */}
        <button
          className="topbar-btn icon-only"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Bright Glass Mode' : 'Dark Glass Mode'}
          aria-label="Toggle Theme"
        >
          {isDarkMode ? <Sun size={17} color="#FBBF24" /> : <Moon size={17} color="#A78BFA" />}
        </button>

        {/* Low Power Mode Toggle */}
        {onToggleLowPowerMode && (
          <button
            className={`topbar-btn icon-only ${lowPowerMode ? 'active-eco' : ''}`}
            onClick={onToggleLowPowerMode}
            title={lowPowerMode ? 'Eco Mode: ON (Battery Saving)' : 'Eco Mode: OFF'}
            aria-label="Toggle Eco Mode"
          >
            {lowPowerMode ? <Zap size={16} color="#10B981" /> : <ZapOff size={16} color="var(--text-muted)" />}
          </button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
