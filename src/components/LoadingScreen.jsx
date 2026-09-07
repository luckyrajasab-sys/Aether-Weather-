import React from 'react';
import { CloudSun, Loader2 } from 'lucide-react';

export const LoadingScreen = ({ message = 'Fetching live atmospheric data...' }) => {
  return (
    <div className="state-screen-container">
      <div
        className="glass-card"
        style={{
          padding: '3rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          maxWidth: '450px',
          textAlign: 'center'
        }}
      >
        <div style={{ position: 'relative' }}>
          <div className="loading-spinner-ring" />
          <CloudSun
            size={28}
            color="var(--accent-color)"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        </div>
        <div>
          <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fff' }}>
            Aether Weather
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
