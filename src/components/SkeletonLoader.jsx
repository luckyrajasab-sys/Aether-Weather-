import React from 'react';

export const SkeletonLoader = () => {
  return (
    <div className="skeleton-container">
      {/* Hero Skeleton */}
      <div className="glass-card skeleton-card skeleton-hero">
        <div className="skeleton-shimmer" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '50%' }}>
          <div className="skeleton-line" style={{ width: '40%', height: '24px' }} />
          <div className="skeleton-line" style={{ width: '70%', height: '48px' }} />
          <div className="skeleton-line" style={{ width: '90px', height: '70px', borderRadius: '16px' }} />
          <div className="skeleton-line" style={{ width: '50%', height: '20px' }} />
        </div>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%' }} className="skeleton-line" />
      </div>

      {/* Grid Skeleton */}
      <div className="details-grid" style={{ marginTop: '1.5rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={`skel-grid-${i}`} className="glass-card skeleton-card" style={{ height: '190px' }}>
            <div className="skeleton-shimmer" />
            <div className="skeleton-line" style={{ width: '40%', height: '18px' }} />
            <div className="skeleton-line" style={{ width: '60%', height: '36px', margin: '1rem 0' }} />
            <div className="skeleton-line" style={{ width: '80%', height: '12px' }} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
