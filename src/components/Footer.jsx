import React from 'react';
import { CloudSun, Radio, ExternalLink } from 'lucide-react';

const Footer = ({ lastUpdated }) => {
  return (
    <footer className="footer">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <CloudSun size={18} color="var(--primary-color)" />
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Aether Weather Pro</span>
        <span>— High Precision Meteorological Dashboard</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        <a
          href="https://developers.google.com/maps/documentation/javascript/get-api-key#get-a-maps-demo-key"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            color: 'var(--text-muted)',
            fontSize: '0.78rem',
            textDecoration: 'none',
            transition: 'color var(--transition-fast)'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--primary-color)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <span>Google Maps API Key</span>
          <ExternalLink size={12} />
        </a>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10B981', fontSize: '0.8rem' }}>
          <Radio size={14} />
          <span>Live Radar Connected</span>
        </div>

        {lastUpdated && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Updated {lastUpdated}
          </span>
        )}
      </div>
    </footer>
  );
};

export default Footer;
