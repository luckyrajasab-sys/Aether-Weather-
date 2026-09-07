import React from 'react';
import { Star, Bookmark, MapPin, Plus } from 'lucide-react';

export const FavoritesBar = ({
  favorites = [],
  currentLocation,
  onSelectFavorite,
  onToggleFavorite,
  isCurrentFavorite
}) => {
  return (
    <div className="favorites-bar-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className={`favorite-toggle-btn ${isCurrentFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(currentLocation)}
          title={isCurrentFavorite ? 'Remove from Starred Favorites' : 'Add to Starred Favorites'}
        >
          <Star size={16} fill={isCurrentFavorite ? '#FBBF24' : 'none'} color={isCurrentFavorite ? '#FBBF24' : 'var(--text-muted)'} />
          <span>{isCurrentFavorite ? 'Starred' : 'Star City'}</span>
        </button>

        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600, margin: '0 0.25rem' }}>
          Favorites:
        </span>
      </div>

      <div className="favorites-scroll-row">
        {favorites.map((fav) => {
          const isActive = fav.name.toLowerCase() === currentLocation.name.toLowerCase();
          return (
            <button
              key={`fav-${fav.name}`}
              className={`fav-chip ${isActive ? 'active' : ''}`}
              onClick={() => onSelectFavorite(fav)}
            >
              <Star size={12} fill="#FBBF24" color="#FBBF24" />
              <span>{fav.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FavoritesBar;
