import React, { useState, useEffect, useCallback } from 'react';
import {
  Home,
  MapPin,
  Trash2,
  Plus,
  X,
  Search,
  Navigation
} from 'lucide-react';
import {
  getSavedLocations,
  setHomeLocation,
  removeSavedLocation,
  saveLocation,
  detectCurrentLocation
} from '../services/locationService';
import {
  searchCities,
  reverseGeocode
} from '../services/weatherService';

export const SavedLocationsModal = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
  onSavedLocationsChange
}) => {
  const [savedList, setSavedList] = useState(() => getSavedLocations());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const refreshList = () => {
    const list = getSavedLocations();
    setSavedList(list);
    if (onSavedLocationsChange) onSavedLocationsChange(list);
  };

  useEffect(() => {
    if (isOpen) {
      refreshList();
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(searchQuery);
        setSearchResults(results || []);
      } catch (err) {
        console.error('Search error in saved modal:', err);
      } finally {
        setIsSearching(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isOpen) return null;

  const handleSetHome = (loc, e) => {
    e.stopPropagation();
    const updated = setHomeLocation(loc);
    setSavedList(updated);
    if (onSavedLocationsChange) onSavedLocationsChange(updated);
  };

  const handleRemove = (loc, e) => {
    e.stopPropagation();
    const updated = removeSavedLocation(loc);
    setSavedList(updated);
    if (onSavedLocationsChange) onSavedLocationsChange(updated);
  };

  const handleAddAndSelect = (city) => {
    const updated = saveLocation(city);
    setSavedList(updated);
    if (onSavedLocationsChange) onSavedLocationsChange(updated);
    onSelectLocation(city);
    onClose();
  };

  const handleDetectCurrent = async () => {
    setIsDetecting(true);
    try {
      const locData = await detectCurrentLocation();
      let target;
      if (locData.name && locData.latitude && locData.longitude) {
        target = locData;
      } else {
        const geocoded = await reverseGeocode(locData.latitude, locData.longitude);
        target = {
          name: geocoded.name || 'My Location',
          country: geocoded.country || '',
          country_code: geocoded.country_code || '',
          admin1: geocoded.admin1 || '',
          latitude: locData.latitude,
          longitude: locData.longitude,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
        };
      }
      handleAddAndSelect(target);
    } catch (err) {
      console.warn('GPS detection in modal failed:', err);
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content glass-card saved-locations-modal"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '580px', maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="sidebar-brand-icon" style={{ width: '32px', height: '32px' }}>
              <Home size={18} color="var(--primary-color)" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>Saved Locations</h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Swipe & switch between your favorite cities • Tap 🏠 to set Home
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Search / Add Bar */}
        <div style={{ padding: '0.75rem 0', display: 'flex', gap: '0.5rem' }}>
          <div className="expanded-search-input-wrap" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-muted)" />
            <input
              type="text"
              className="expanded-search-input"
              placeholder="Search & add new city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                onClick={() => setSearchQuery('')}
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            className="nav-btn"
            style={{ height: '40px', padding: '0 0.85rem' }}
            onClick={handleDetectCurrent}
            disabled={isDetecting}
            title="Detect GPS Location"
          >
            <Navigation size={15} color="var(--primary-color)" />
            <span style={{ fontSize: '0.8rem' }}>{isDetecting ? 'Locating...' : 'GPS'}</span>
          </button>
        </div>

        {/* Search Results Dropdown if searching */}
        {searchQuery.length >= 2 && (
          <div className="saved-search-results glass-card" style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '0.75rem' }}>
            {isSearching ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Searching global database...
              </div>
            ) : searchResults.length === 0 ? (
              <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                No cities found matching "{searchQuery}"
              </div>
            ) : (
              searchResults.map((city) => (
                <div
                  key={`${city.name}-${city.latitude}-${city.longitude}`}
                  className="saved-search-item"
                  onClick={() => handleAddAndSelect(city)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MapPin size={15} color="var(--primary-color)" />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{city.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.4rem' }}>
                        {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                      </span>
                    </div>
                  </div>
                  <button className="add-city-pill-btn">
                    <Plus size={13} /> Add
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Saved Cities Cards List */}
        <div className="saved-cities-list-scroll" style={{ overflowY: 'auto', flex: 1, paddingRight: '0.25rem' }}>
          {savedList.length === 0 ? (
            <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              <p>No saved cities yet. Search above to add your favorite locations!</p>
            </div>
          ) : (
            savedList.map((loc) => {
              const isSelected = loc.name.toLowerCase() === currentLocation?.name?.toLowerCase();
              return (
                <div
                  key={`saved-${loc.name}-${loc.latitude}`}
                  className={`saved-city-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                >
                  <div className="saved-card-left">
                    <div className="saved-card-title-row">
                      <span className="saved-card-city-name">{loc.name}</span>
                      {loc.isHome && (
                        <span className="home-city-badge">
                          <Home size={12} /> HOME
                        </span>
                      )}
                    </div>
                    <div className="saved-card-sub">
                      {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country || 'Global'}
                    </div>
                  </div>

                  <div className="saved-card-actions" onClick={(e) => e.stopPropagation()}>
                    {/* Home Toggle */}
                    <button
                      className={`saved-action-icon-btn ${loc.isHome ? 'is-home' : ''}`}
                      onClick={(e) => handleSetHome(loc, e)}
                      title={loc.isHome ? 'Home City (Default)' : 'Set as Home City'}
                    >
                      <Home size={16} />
                    </button>

                    {/* Delete */}
                    <button
                      className="saved-action-icon-btn delete-btn"
                      onClick={(e) => handleRemove(loc, e)}
                      title="Remove from Saved"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {savedList.length} saved {savedList.length === 1 ? 'city' : 'cities'}
          </span>
          <button className="nav-btn primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavedLocationsModal;
