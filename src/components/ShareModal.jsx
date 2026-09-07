import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  X,
  Download,
  Link2,
  Check,
  Share2,
  CloudSun,
  MapPin,
  Sparkles,
  Wind,
  Droplets,
  Sun
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemperature } from '../utils/formatWeatherData';

export const ShareModal = ({ isOpen, onClose, weather, location, tempUnit }) => {
  const cardPreviewRef = useRef(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen || !weather || !weather.current) return null;

  const current = weather.current;

  // Copy share URL with query params
  const handleCopyLink = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set('city', location.name);
    if (location.latitude && location.longitude) {
      url.searchParams.set('lat', location.latitude.toFixed(4));
      url.searchParams.set('lon', location.longitude.toFixed(4));
    }

    navigator.clipboard.writeText(url.toString());
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  // Export card as PNG using html2canvas
  const handleDownloadPNG = async () => {
    if (!cardPreviewRef.current) return;
    setIsExporting(true);
    try {
      const canvas = await html2canvas(cardPreviewRef.current, {
        scale: 2,
        backgroundColor: null,
        useCORS: true
      });

      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Aether_Weather_${location.name.replace(/\s+/g, '_')}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to export card:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass-card share-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Share2 size={18} color="var(--primary-color)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Share Weather Snapshot</h3>
          </div>
          <button className="chat-tool-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Shareable Card Canvas Preview */}
        <div className="share-card-canvas-wrapper" ref={cardPreviewRef}>
          <div className="share-card-canvas">
            {/* Background branding glow */}
            <div className="share-card-glow" />

            <div className="share-card-top-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <CloudSun size={20} color="#FBBF24" />
                <span style={{ fontWeight: 800, fontSize: '0.95rem', letterSpacing: '-0.02em' }}>Aether Weather Pro</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Live Telemetry</span>
            </div>

            <div className="share-card-main-content">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-color)', fontSize: '0.95rem', fontWeight: 700 }}>
                  <MapPin size={16} />
                  <span>{[location.name, location.country].filter(Boolean).join(', ')}</span>
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1, margin: '0.35rem 0', letterSpacing: '-0.03em' }}>
                  {formatTemperature(current.temperature, tempUnit)}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>
                  {current.condition}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)', marginTop: '0.2rem' }}>
                  Feels like {formatTemperature(current.apparentTemperature, tempUnit)}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <WeatherIcon name={current.iconName} size={84} color="#FBBF24" />
              </div>
            </div>

            {/* Bottom 3 metrics */}
            <div className="share-card-metrics-row">
              <div className="share-metric-box">
                <Droplets size={14} color="#38BDF8" />
                <span>{Math.round(current.humidity)}% Humidity</span>
              </div>
              <div className="share-metric-box">
                <Wind size={14} color="#A855F7" />
                <span>{Math.round(current.windSpeed)} km/h Wind</span>
              </div>
              <div className="share-metric-box">
                <Sun size={14} color="#F59E0B" />
                <span>UV {Math.round(current.uvIndex)}/12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="share-modal-actions">
          <button
            className="nav-btn"
            onClick={handleCopyLink}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            {isCopied ? <Check size={16} color="#10B981" /> : <Link2 size={16} />}
            <span>{isCopied ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <button
            className="nav-btn primary"
            onClick={handleDownloadPNG}
            disabled={isExporting}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            <Download size={16} />
            <span>{isExporting ? 'Exporting...' : 'Download Image Card'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
