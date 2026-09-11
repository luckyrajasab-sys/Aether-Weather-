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
  ZapOff
} from 'lucide-react';

export const FloatingSideBar = ({
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
  onToggleLowPowerMode
}) => {
  return (
    <aside className="flying-sidebar-dock glass-card">
      {/* Brand Icon & Popped Logo */}
      <div
        className="sidebar-brand-btn"
        onClick={() => onRequestLocation()}
        title="Aether Weather Pro — Click to Refresh My Location"
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
          title="Detect GPS / IP Location"
          aria-label="Detect Current Location"
        >
          {isLoadingLocation ? (
            <Loader2 size={18} className="spin-fast" />
          ) : (
            <Navigation size={18} />
          )}
          <div className="sidebar-tooltip">{isLoadingLocation ? 'Locating...' : 'My Location'}</div>
        </button>

        {/* AI Meteorologist Chat Launcher */}
        {onOpenChat && (
          <button
            className="sidebar-action-btn ai-btn"
            onClick={onOpenChat}
            title="Ask Aether AI Meteorologist"
            aria-label="Open AI Meteorologist"
          >
            <Sparkles size={18} className="sparkle-anim" color="#38BDF8" />
            <div className="sidebar-tooltip">AI Meteorologist</div>
          </button>
        )}

        {/* Saved Locations Manager */}
        {onOpenSaved && (
          <button
            className="sidebar-action-btn"
            onClick={onOpenSaved}
            title="Saved Locations & Home City"
            aria-label="Manage Saved Locations"
          >
            <Bookmark size={18} color="#FBBF24" />
            <div className="sidebar-tooltip">Saved Cities</div>
          </button>
        )}

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

        {/* Low Power Mode Toggle */}
        {onToggleLowPowerMode && (
          <button
            className={`sidebar-action-btn ${lowPowerMode ? 'active-power' : ''}`}
            onClick={onToggleLowPowerMode}
            title={lowPowerMode ? 'Low Power Mode: ON (Fast)' : 'Low Power Mode: OFF'}
            aria-label="Toggle Low Power Mode"
          >
            {lowPowerMode ? <Zap size={18} color="#10B981" /> : <ZapOff size={18} color="var(--text-muted)" />}
            <div className="sidebar-tooltip">{lowPowerMode ? 'Eco Mode: ON' : 'Eco Mode: OFF'}</div>
          </button>
        )}
      </div>
    </aside>
  );
};

export default FloatingSideBar;
