import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Loader2, Clock } from 'lucide-react';
import { searchCities } from '../services/weatherService';
import { getRecentSearches, saveRecentSearch } from '../services/locationService';

export const BottomSearchBar = ({ onSelectLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchContainerRef = useRef(null);

  // Load recent searches
  useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchCities(query);
      setSuggestions(results);
      setIsSearching(false);
      setIsOpen(true);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (loc) => {
    saveRecentSearch(loc);
    setRecentSearches(getRecentSearches());
    onSelectLocation(loc);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="bottom-search-dock" ref={searchContainerRef}>
      {/* Suggestions & Recent Searches Dropdown (Opens Upward) */}
      {isOpen && (
        <div className="bottom-search-dropdown glass-card">
          {suggestions.length > 0 ? (
            <div>
              <div className="dropdown-header">
                <span>Matching Places ({suggestions.length})</span>
              </div>
              {suggestions.map((loc) => {
                const isIndia = loc.country_code === 'IN' || loc.country?.toLowerCase() === 'india';
                const locationSubtitle = [loc.admin2, loc.admin1, loc.country].filter(Boolean).join(', ');

                return (
                  <div
                    key={`${loc.id}-${loc.latitude}-${loc.longitude}`}
                    className="dropdown-item"
                    onClick={() => handleSelect(loc)}
                  >
                    <MapPin size={16} color={isIndia ? '#FBBF24' : 'var(--primary-color)'} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span className="dropdown-item-title">{loc.name}</span>
                        {isIndia && (
                          <span style={{ fontSize: '0.68rem', fontWeight: 700, padding: '0.15rem 0.45rem', borderRadius: '6px', background: 'rgba(245, 158, 11, 0.18)', color: '#FDE68A', border: '1px solid rgba(245, 158, 11, 0.35)' }}>
                            🇮🇳 India
                          </span>
                        )}
                      </div>
                      <div className="dropdown-item-subtitle">
                        {locationSubtitle}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : query.trim().length >= 2 && !isSearching ? (
            <div style={{ padding: '1.25rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No places found for "{query}". Try searching another city, district, or town.
            </div>
          ) : null}

          {/* Recent Searches Section */}
          {recentSearches.length > 0 && (!query || query.length < 2) && (
            <div>
              <div className="dropdown-header">
                <span>Recent Searches</span>
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.7rem' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    localStorage.removeItem('weather_recent_searches');
                    setRecentSearches([]);
                  }}
                >
                  Clear
                </button>
              </div>
              {recentSearches.map((loc, idx) => (
                <div
                  key={`recent-${loc.name}-${idx}`}
                  className="dropdown-item"
                  onClick={() => handleSelect(loc)}
                >
                  <Clock size={16} color="var(--text-dim)" />
                  <div>
                    <div className="dropdown-item-title">{loc.name}</div>
                    <div className="dropdown-item-subtitle">{[loc.admin1, loc.country].filter(Boolean).join(', ') || 'Recent'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Floating Bottom Search Bar Pill */}
      <div className="bottom-search-pill glass-card">
        <Search size={17} color="var(--primary-color)" />
        <input
          type="text"
          className="bottom-search-input"
          placeholder="Search any city or place in India..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-label="Search city or place"
        />
        {isSearching ? (
          <Loader2 size={16} className="search-clear-btn" style={{ animation: 'spin 1s linear infinite' }} />
        ) : query ? (
          <button className="search-clear-btn" onClick={handleClear} aria-label="Clear search">
            <X size={16} />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default BottomSearchBar;
