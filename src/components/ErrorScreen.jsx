import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorScreen = ({ error, onRetry }) => {
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
          maxWidth: '480px',
          textAlign: 'center'
        }}
      >
        <div className="error-icon-box">
          <AlertCircle size={42} />
        </div>
        <div>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.5rem', color: '#FEF2F2' }}>
            Unable to Fetch Weather Data
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            {error || 'Please check your internet connection or try searching for another city.'}
          </p>
        </div>
        {onRetry && (
          <button
            className="nav-btn primary"
            onClick={onRetry}
            style={{ marginTop: '0.5rem', padding: '0 1.5rem' }}
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorScreen;
