import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Radio,
  ExternalLink,
  Key,
  Check,
  X,
  Globe,
  Maximize2,
  Minimize2,
  Plus,
  Minus,
  LocateFixed
} from 'lucide-react';

const COLOR_SCHEMES = [
  { id: 2, name: 'Universal Doppler' },
  { id: 1, name: 'Titan HD' },
  { id: 4, name: 'Rainbow Colors' },
  { id: 6, name: 'Deep Contrast' }
];

const PLAYBACK_SPEEDS = [
  { label: '0.5x', delay: 1200 },
  { label: '1x', delay: 650 },
  { label: '2x', delay: 320 }
];

export const WeatherRadar = ({ latitude, longitude, locationName }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radarLayerRef = useRef(null);
  const markerRef = useRef(null);

  const [timestamps, setTimestamps] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [radarColor, setRadarColor] = useState(2);
  const [speedIdx, setSpeedIdx] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapProvider, setMapProvider] = useState(() => localStorage.getItem('weather_map_provider') || 'leaflet');
  const [googleApiKey, setGoogleApiKey] = useState(() => localStorage.getItem('google_maps_api_key') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDRbNQm6rHnwxxsLoTNFOhSBEVayq-Ph6I');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(googleApiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize or re-center Leaflet Map
  useEffect(() => {
    if (mapProvider !== 'leaflet' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager / Dark Basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom pulsing city marker
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="radar-city-pin"><span>${locationName || 'City'}</span></div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      const marker = L.marker([latitude, longitude], { icon: customIcon }).addTo(map);
      markerRef.current = marker;
      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([latitude, longitude], isFullscreen ? 8 : 7);
      if (markerRef.current) {
        markerRef.current.setLatLng([latitude, longitude]);
      }
    }

    // Trigger size invalidation smoothly
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [latitude, longitude, locationName, mapProvider, isFullscreen]);

  // Handle Fullscreen Invalidate Size & Keyboard Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Fetch RainViewer radar frame timestamps
  useEffect(() => {
    const fetchRadarFrames = async () => {
      try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!response.ok) throw new Error('Failed to fetch radar timestamps');
        const data = await response.json();

        const past = data.radar?.past || [];
        const nowcast = data.radar?.nowcast || [];
        const frames = past.concat(nowcast);
        if (frames.length > 0) {
          setTimestamps(frames);
          const initialIdx = past.length > 0 ? past.length - 1 : frames.length - 1;
          setCurrentFrameIdx(initialIdx);
        }
      } catch (err) {
        console.warn('RainViewer API error:', err);
      }
    };

    fetchRadarFrames();
  }, []);

  // Update radar tile layer when frame changes in Leaflet
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || timestamps.length === 0 || mapProvider !== 'leaflet') return;

    const frame = timestamps[currentFrameIdx];
    if (!frame) return;

    if (radarLayerRef.current) {
      map.removeLayer(radarLayerRef.current);
    }

    const tilePath = frame.path;
    const tileUrl = `https://tilecache.rainviewer.com${tilePath}/256/{z}/{x}/{y}/${radarColor}/1_1.png`;

    const newLayer = L.tileLayer(tileUrl, {
      opacity: 0.78,
      zIndex: 10
    });

    newLayer.addTo(map);
    radarLayerRef.current = newLayer;
  }, [currentFrameIdx, timestamps, radarColor, mapProvider]);

  // Animation Loop with selected speed
  useEffect(() => {
    let interval;
    if (isPlaying && timestamps.length > 0) {
      const delay = PLAYBACK_SPEEDS[speedIdx].delay;
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % timestamps.length);
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timestamps, speedIdx]);

  // Zoom helpers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleCenterLocation = () => {
    mapInstanceRef.current?.setView([latitude, longitude], isFullscreen ? 8 : 7, { animate: true });
  };

  const handleSaveKey = () => {
    localStorage.setItem('google_maps_api_key', keyInput);
    setGoogleApiKey(keyInput);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleToggleProvider = (provider) => {
    setMapProvider(provider);
    localStorage.setItem('weather_map_provider', provider);
  };

  const currentFrameObj = timestamps[currentFrameIdx];
  const isNowcast = currentFrameObj && currentFrameObj.time * 1000 > Date.now();
  const currentFrameTime = currentFrameObj
    ? new Date(currentFrameObj.time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  const timeDiffMins = currentFrameObj
    ? Math.round((currentFrameObj.time * 1000 - Date.now()) / (60 * 1000))
    : 0;

  const timeRelativeLabel = timeDiffMins > 0
    ? `+${timeDiffMins}m (Forecast)`
    : timeDiffMins >= -5
    ? 'LIVE NOW'
    : `${Math.abs(timeDiffMins)}m ago`;

  // Radar Map Controls and Viewport markup
  const renderMapContent = () => (
    <>
      {/* Header Row */}
      <div className="section-title-row">
        <h3 className="section-title">
          <Radio size={20} color="var(--primary-color)" />
          <span>Interactive Live Radar & Doppler Maps</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {/* Color Palette Selector */}
          <select
            className="radar-palette-select"
            value={radarColor}
            onChange={(e) => setRadarColor(Number(e.target.value))}
            title="Radar Color Palette"
          >
            {COLOR_SCHEMES.map((cs) => (
              <option key={cs.id} value={cs.id}>{cs.name}</option>
            ))}
          </select>

          {/* Fullscreen Expand / Exit Button */}
          <button
            className={`nav-btn expand-radar-btn ${isFullscreen ? 'active-fullscreen' : ''}`}
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Expand Fullscreen Radar'}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} color="#FBBF24" /> : <Maximize2 size={16} />}
            <span className="expand-btn-text">{isFullscreen ? 'Close Fullscreen' : 'Expand Map'}</span>
          </button>

          {/* Google Maps Key Button */}
          <button
            className="nav-btn"
            style={{ height: '34px', fontSize: '0.78rem', padding: '0 0.85rem' }}
            onClick={() => setIsKeyModalOpen(true)}
            title="Google Maps API Key & Layer Settings"
          >
            <Key size={14} color="#FBBF24" />
            <span>Map Key</span>
          </button>

          <span className="radar-live-badge">
            <span className="radar-pulse-dot" /> LIVE DOPPLER
          </span>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="radar-map-wrapper">
        <div ref={mapContainerRef} className="radar-leaflet-map" />

        {/* Floating Quick Tools (Zoom + Center) */}
        <div className="radar-floating-tools">
          <button className="radar-tool-btn" onClick={handleZoomIn} title="Zoom In">
            <Plus size={16} />
          </button>
          <button className="radar-tool-btn" onClick={handleZoomOut} title="Zoom Out">
            <Minus size={16} />
          </button>
          <button className="radar-tool-btn center-loc" onClick={handleCenterLocation} title="Center on My City">
            <LocateFixed size={16} />
          </button>
        </div>

        {/* Floating Playback Controls Bar */}
        {mapProvider === 'leaflet' && (
          <div className="radar-controls-floating glass-card">
            <div className="radar-ctrl-btn-group">
              <button
                className="radar-ctrl-btn"
                onClick={() => setCurrentFrameIdx((prev) => (prev - 1 + timestamps.length) % timestamps.length)}
                title="Previous Frame (Past)"
              >
                <SkipBack size={15} />
              </button>

              <button
                className="radar-ctrl-btn play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause Doppler Animation' : 'Play Doppler Radar Animation'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                className="radar-ctrl-btn"
                onClick={() => setCurrentFrameIdx((prev) => (prev + 1) % timestamps.length)}
                title="Next Frame (Forward)"
              >
                <SkipForward size={15} />
              </button>

              {/* Speed Switcher */}
              <button
                className="radar-speed-toggle-btn"
                onClick={() => setSpeedIdx((prev) => (prev + 1) % PLAYBACK_SPEEDS.length)}
                title={`Playback Speed: ${PLAYBACK_SPEEDS[speedIdx].label}`}
              >
                {PLAYBACK_SPEEDS[speedIdx].label}
              </button>
            </div>

            <div className="radar-timestamp-badge">
              <span className={`radar-time-pill ${isNowcast ? 'nowcast' : ''}`}>
                {timeRelativeLabel}
              </span>
              <span className="radar-exact-time">{currentFrameTime}</span>
            </div>

            {/* Timeline progress slider */}
            {timestamps.length > 0 && (
              <input
                type="range"
                min="0"
                max={timestamps.length - 1}
                value={currentFrameIdx}
                onChange={(e) => setCurrentFrameIdx(Number(e.target.value))}
                className="radar-slider"
                aria-label="Radar frame playback scrubber"
              />
            )}
          </div>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* Normal Embedded Card on Dashboard */}
      {!isFullscreen && (
        <div className="glass-card radar-card-container animate-fade-in">
          {renderMapContent()}
        </div>
      )}

      {/* Fullscreen Portal rendered directly into document.body to break free of any stacking contexts */}
      {isFullscreen &&
        createPortal(
          <div className="radar-fullscreen-portal-overlay animate-fade-in">
            <div className="radar-fullscreen-portal-card glass-card">
              {renderMapContent()}
            </div>
          </div>,
          document.body
        )}

      {/* Google Maps API Key & Settings Modal */}
      {isKeyModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsKeyModalOpen(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Globe size={20} color="var(--primary-color)" />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>Google Maps API Key Configuration</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setIsKeyModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ margin: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                Connect your Google Maps JavaScript API key to enable native Google Maps satellite, terrain, and road views.
              </p>

              <div style={{ padding: '0.85rem 1rem', background: 'rgba(255, 255, 255, 0.06)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>
                  OFFICIAL GOOGLE MAPS DOCUMENTATION:
                </div>
                <a
                  href="https://developers.google.com/maps/documentation/javascript/get-api-key#get-a-maps-demo-key"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-color)', fontSize: '0.88rem', fontWeight: 700, textDecoration: 'none' }}
                >
                  <span>Get a Google Maps API Key / Demo Key</span>
                  <ExternalLink size={15} />
                </a>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Paste Google Maps API Key:
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="search-input"
                    style={{ height: '40px', padding: '0 0.85rem' }}
                    placeholder="AIzaSy..."
                    value={keyInput}
                    onChange={(e) => setKeyInput(e.target.value)}
                  />
                  <button
                    className="nav-btn primary"
                    onClick={handleSaveKey}
                    style={{ height: '40px', padding: '0 1rem' }}
                  >
                    {saveSuccess ? <Check size={16} /> : 'Save'}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                  Active Map Layer:
                </label>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className={`unit-btn ${mapProvider === 'leaflet' ? 'active' : ''}`}
                    onClick={() => handleToggleProvider('leaflet')}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)' }}
                  >
                    🌧️ RainViewer Doppler Radar
                  </button>
                  <button
                    className={`unit-btn ${mapProvider === 'google' ? 'active' : ''}`}
                    onClick={() => handleToggleProvider('google')}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 'var(--radius-md)' }}
                  >
                    🗺️ Google Maps View
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1rem' }}>
              <button className="nav-btn" onClick={() => setIsKeyModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WeatherRadar;
