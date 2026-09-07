import React, { useState } from 'react';
import {
  Building2,
  ChevronDown,
  ArrowLeft,
  MapPin,
  Search,
  X
} from 'lucide-react';
import { POPULAR_LOCATIONS, EXTENDED_CITIES_BY_CATEGORY } from '../services/locationService';

export const LocationMeta = ({ location, onSelectCity }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const handleSelect = (city) => {
    onSelectCity(city);
    setIsExpanded(false);
    setFilterQuery('');
  };

  return (
    <div className="quick-cities-container animate-fade-in stagger-1">
      {/* 1. Default Compact Strip with Interactive 'Major Cities' Button */}
      {!isExpanded ? (
        <div className="quick-cities-bar">
          {/* Main 'Major Cities' Button that triggers full expansion */}
          <button
            className="major-cities-trigger-btn"
            onClick={() => setIsExpanded(true)}
            title="Click to view all State Capitals & Popular Cities"
          >
            <Building2 size={16} color="var(--primary-color)" className="anim-pulse" />
            <span>Major Cities</span>
            <ChevronDown size={14} color="var(--primary-color)" />
          </button>

          {/* Quick Major Cities Chips */}
          {POPULAR_LOCATIONS.map((city) => {
            const isActive = city.name.toLowerCase() === location.name.toLowerCase();
            return (
              <button
                key={city.name}
                className={`city-chip ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCity(city)}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      ) : (
        /* 2. Expanded All Cities View with Back Button */
        <div className="all-cities-expanded-card glass-card animate-fade-in">
          {/* Header with Back Button */}
          <div className="expanded-cities-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              {/* Back Button */}
              <button
                className="cities-back-btn"
                onClick={() => {
                  setIsExpanded(false);
                  setFilterQuery('');
                }}
                title="Back to compact city strip"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div>
                <h3 className="expanded-header-title">All Major Cities & State Capitals</h3>
                <span className="expanded-header-subtitle">
                  Showing popular metros, state capitals, and economic hubs
                </span>
              </div>
            </div>

            {/* Quick Search inside cities view */}
            <div className="expanded-search-input-wrap">
              <Search size={15} color="var(--text-muted)" />
              <input
                type="text"
                className="expanded-search-input"
                placeholder="Search city, state, or capital..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                autoFocus
              />
              {filterQuery && (
                <button
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                  onClick={() => setFilterQuery('')}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* All Categorized Cities Grid */}
          <div className="expanded-categories-list">
            {EXTENDED_CITIES_BY_CATEGORY.map((section) => {
              const filteredCities = section.cities.filter(
                (c) =>
                  c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
                  (c.tag && c.tag.toLowerCase().includes(filterQuery.toLowerCase())) ||
                  (c.country && c.country.toLowerCase().includes(filterQuery.toLowerCase()))
              );

              if (filteredCities.length === 0) return null;

              return (
                <div key={section.category} className="extended-category-block">
                  <h4 className="extended-category-title">{section.category}</h4>
                  <div className="extended-cities-grid">
                    {filteredCities.map((city) => {
                      const isActive = city.name.toLowerCase() === location.name.toLowerCase();
                      return (
                        <div
                          key={city.name}
                          className={`extended-city-card ${isActive ? 'active' : ''}`}
                          onClick={() => handleSelect(city)}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span className="ext-city-name">{city.name}</span>
                            <MapPin size={14} color={isActive ? '#FBBF24' : 'var(--primary-color)'} />
                          </div>
                          {city.tag && (
                            <span className="ext-city-tag">{city.tag}</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMeta;
