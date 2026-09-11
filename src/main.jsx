import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register PWA Service Worker for mobile offline capability
if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(
      (registration) => {
        console.log('Aether PWA ServiceWorker registration successful with scope: ', registration.scope);
      },
      (err) => {
        console.warn('Aether PWA ServiceWorker registration failed: ', err);
      }
    );
  });
}
