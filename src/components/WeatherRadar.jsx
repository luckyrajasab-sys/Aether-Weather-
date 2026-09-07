import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Layers,
  Radio,
  ExternalLink,
  Key,
  Check,
  X,
  MapPin,
  Globe
} from 'lucide-react';

export const WeatherRadar = ({ latitude, longitude, locationName }) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const radarLayerRef = useRef(null);
  const googleMapRef = useRef(null);

  const [timestamps, setTimestamps] = useState([]);
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [radarColor, setRadarColor] = useState(2); // 2: Universal Blue/Green/Red
  const [mapProvider, setMapProvider] = useState(() => localStorage.getItem('weather_map_provider') || 'leaflet'); // 'leaflet' | 'google'
  const [googleApiKey, setGoogleApiKey] = useState(() => localStorage.getItem('google_maps_api_key') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDRbNQm6rHnwxxsLoTNFOhSBEVayq-Ph6I');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [keyInput, setKeyInput] = useState(googleApiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Initialize Leaflet Map
  useEffect(() => {
    if (mapProvider !== 'leaflet' || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [latitude, longitude],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      // Dark Matter CartoDB Basemap
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom city marker with pulsing glow
      const customIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div class="radar-city-pin"><span>${locationName || 'City'}</span></div>`,
        iconSize: [80, 30],
        iconAnchor: [40, 15]
      });

      L.marker([latitude, longitude], { icon: customIcon }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([latitude, longitude], 7);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, locationName, mapProvider]);

  // Fetch RainViewer radar frame timestamps
  useEffect(() => {
    const fetchRadarFrames = async () => {
      try {
        const response = await fetch('https://api.rainviewer.com/public/weather-maps.json');
        if (!response.ok) throw new Error('Failed to fetch radar timestamps');
        const data = await response.json();

        const frames = (data.radar?.past || []).concat(data.radar?.nowcast || []);
        if (frames.length > 0) {
          setTimestamps(frames);
          setCurrentFrameIdx(frames.length - 1); // latest
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
      opacity: 0.72,
      zIndex: 10
    });

    newLayer.addTo(map);
    radarLayerRef.current = newLayer;
  }, [currentFrameIdx, timestamps, radarColor, mapProvider]);

  // Load Google Maps Script if Google Maps provider selected
  useEffect(() => {
    if (mapProvider !== 'google') return;

    const scriptId = 'google-maps-script';
    let script = document.getElementById(scriptId);

    const initGoogleMap = () => {
      if (window.google && mapContainerRef.current) {
        const gMap = new window.google.maps.Map(mapContainerRef.current, {
          center: { lat: latitude, lng: longitude },
          zoom: 8,
          mapTypeId: 'terrain',
          disableDefaultUI: true
        });

        new window.google.maps.Marker({
          position: { lat: latitude, lng: longitude },
          map: gMap,
          title: locationName
        });

        googleMapRef.current = gMap;
      }
    };

    if (!window.google) {
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://maps.googleapis.com/maps/api/js?key=${googleApiKey || ''}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initGoogleMap;
        document.head.appendChild(script);
      }
    } else {
      initGoogleMap();
    }
  }, [mapProvider, googleApiKey, latitude, longitude, locationName]);

  // Animation Loop
  useEffect(() => {
    let interval;
    if (isPlaying && timestamps.length > 0) {
      interval = setInterval(() => {
        setCurrentFrameIdx((prev) => (prev + 1) % timestamps.length);
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlaying, timestamps]);

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

  const currentFrameTime = timestamps[currentFrameIdx]
    ? new Date(timestamps[currentFrameIdx].time * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '--:--';

  return (
    <div className="glass-card radar-card-container animate-fade-in">
      <div className="section-title-row">
        <h3 className="section-title">
          <Radio size={20} color="var(--primary-color)" />
          <span>Interactive Live Radar & Maps</span>
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Map API Key & Layers Button */}
          <button
            className="nav-btn"
            style={{ height: '34px', fontSize: '0.78rem', padding: '0 0.85rem' }}
            onClick={() => setIsKeyModalOpen(true)}
            title="Google Maps API Key & Layer Settings"
          >
            <Key size={14} color="#FBBF24" />
            <span>Google Maps Key</span>
          </button>

          <span className="radar-live-badge">
            <span className="radar-pulse-dot" /> LIVE DOPPLER
          </span>
        </div>
      </div>

      {/* Map Viewport Container */}
      <div className="radar-map-wrapper">
        <div ref={mapContainerRef} className="radar-leaflet-map" key={mapProvider} />

        {/* Floating Playback Controls Bar */}
        {mapProvider === 'leaflet' && (
          <div className="radar-controls-floating glass-card">
            <div className="radar-ctrl-btn-group">
              <button
                className="radar-ctrl-btn"
                onClick={() => setCurrentFrameIdx((prev) => (prev - 1 + timestamps.length) % timestamps.length)}
                title="Previous Frame"
              >
                <SkipBack size={15} />
              </button>

              <button
                className="radar-ctrl-btn play-btn"
                onClick={() => setIsPlaying(!isPlaying)}
                title={isPlaying ? 'Pause' : 'Play Animation'}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>

              <button
                className="radar-ctrl-btn"
                onClick={() => setCurrentFrameIdx((prev) => (prev + 1) % timestamps.length)}
                title="Next Frame"
              >
                <SkipForward size={15} />
              </button>
            </div>

            <div className="radar-timestamp-badge">
              <span>{currentFrameTime}</span>
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
              />
            )}
          </div>
        )}
      </div>

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

              {/* Direct Official Link */}
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

              {/* Input for Google Maps API Key */}
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

              {/* Map Provider Switcher */}
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
    </div>
  );
};

export default WeatherRadar;
