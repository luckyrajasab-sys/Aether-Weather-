import React, { useRef } from 'react';
import { Star, Home, Bookmark, Plus, Settings2, ChevronLeft, ChevronRight } from 'lucide-react';

export const FavoritesBar = ({
  favorites = [],
  currentLocation,
  onSelectFavorite,
  onToggleFavorite,
  isCurrentFavorite,
  onOpenManageSaved
}) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="favorites-bar-container animate-fade-in stagger-1">
      <div className="favorites-header-left">
        {/* Save / Star Current Location Toggle */}
        <button
          className={`favorite-toggle-btn ${isCurrentFavorite ? 'active' : ''}`}
          onClick={() => onToggleFavorite(currentLocation)}
          title={isCurrentFavorite ? 'Remove from Saved Cities' : 'Save this City'}
        >
          <Star
            size={16}
            fill={isCurrentFavorite ? '#FBBF24' : 'none'}
            color={isCurrentFavorite ? '#FBBF24' : 'var(--text-muted)'}
          />
          <span className="fav-toggle-label">{isCurrentFavorite ? 'Saved' : 'Save City'}</span>
        </button>

        {/* Manage Saved Button */}
        {onOpenManageSaved && (
          <button
            className="manage-saved-btn"
            onClick={onOpenManageSaved}
            title="Manage Saved Cities & Set Home"
          >
            <Settings2 size={15} color="var(--primary-color)" />
            <span>Manage</span>
          </button>
        )}
      </div>

      {/* Horizontal Scroll / Swipeable Track */}
      <div className="favorites-scroll-wrapper">
        <button
          className="fav-scroll-arrow left"
          onClick={() => scroll('left')}
          aria-label="Scroll saved locations left"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="favorites-scroll-row" ref={scrollRef}>
          {favorites.map((fav) => {
            const isActive = fav.name.toLowerCase() === currentLocation?.name?.toLowerCase();
            return (
              <button
                key={`fav-${fav.name}-${fav.latitude}`}
                className={`fav-chip ${isActive ? 'active' : ''} ${fav.isHome ? 'is-home-chip' : ''}`}
                onClick={() => onSelectFavorite(fav)}
                title={fav.isHome ? `${fav.name} (Home City)` : fav.name}
              >
                {fav.isHome ? (
                  <Home size={13} className="fav-chip-icon home" />
                ) : (
                  <Star size={12} fill={isActive ? '#FBBF24' : 'none'} color="#FBBF24" />
                )}
                <span className="fav-chip-name">{fav.name}</span>
                {fav.isHome && <span className="fav-home-dot" />}
              </button>
            );
          })}
        </div>

        <button
          className="fav-scroll-arrow right"
          onClick={() => scroll('right')}
          aria-label="Scroll saved locations right"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default FavoritesBar;
