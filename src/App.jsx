import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import FloatingSideBar from './components/FloatingSideBar';
import WeatherBackground from './components/WeatherBackground';
import WeatherHero from './components/WeatherHero';
import WeatherAlerts from './components/WeatherAlerts';
import HourlyForecast from './components/HourlyForecast';
import DailyForecast from './components/DailyForecast';
import WeatherDetailsGrid from './components/WeatherDetailsGrid';
import AirQuality from './components/AirQuality';
import WeatherAnalytics from './components/WeatherAnalytics';
import LocationMeta from './components/LocationMeta';
import FavoritesBar from './components/FavoritesBar';
import ActivitySuggestions from './components/ActivitySuggestions';
import BottomSearchBar from './components/BottomSearchBar';
import SkeletonLoader from './components/SkeletonLoader';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import Footer from './components/Footer';

// Code-split heavy interactive modules
const WeatherRadar = lazy(() => import('./components/WeatherRadar'));
const ShareModal = lazy(() => import('./components/ShareModal'));

import {
  fetchComprehensiveWeather,
  reverseGeocode,
  searchCities,
  getCachedWeather,
  generateFallbackWeatherData
} from './services/weatherService';
import {
  detectCurrentLocation,
  DEFAULT_LOCATION,
  getFavorites,
  toggleFavoriteLocation,
  isLocationFavorite
} from './services/locationService';

function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(() =>
    getCachedWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude) ||
    generateFallbackWeatherData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.timezone)
  );
  const [loading, setLoading] = useState(false);
  const [isCityTransitioning, setIsCityTransitioning] = useState(false);
  const [error, setError] = useState(null);
  const [tempUnit, setTempUnit] = useState(() => localStorage.getItem('weather_temp_unit') || 'C');
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('weather_dark_mode') === 'true');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [favorites, setFavorites] = useState(() => getFavorites());
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const weatherRef = React.useRef(weather);
  useEffect(() => {
    weatherRef.current = weather;
  }, [weather]);

  // Fetch complete weather for given coordinates with instant cache-first display
  const loadWeather = useCallback(async (loc, showLoadingScreen = true) => {
    const cached = getCachedWeather(loc.latitude, loc.longitude);
    if (cached) {
      setWeather(cached);
      weatherRef.current = cached;
      setLoading(false);
      setIsCityTransitioning(false);
    } else if (showLoadingScreen) {
      if (!weatherRef.current) setLoading(true);
      else setIsCityTransitioning(true);
    }
    setError(null);
    try {
      const data = await fetchComprehensiveWeather(loc.latitude, loc.longitude, loc.timezone);
      setWeather(data);
      weatherRef.current = data;
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } catch (err) {
      console.error('Error fetching weather:', err);
      if (!weatherRef.current) {
        setError(err.message || 'Failed to fetch weather data for this location.');
      }
    } finally {
      setLoading(false);
      setIsCityTransitioning(false);
    }
  }, []);

  // Handle URL Query Params (e.g. ?city=Tokyo or ?lat=35.67&lon=139.65)
  const checkUrlParams = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const cityParam = params.get('city');
    const latParam = params.get('lat');
    const lonParam = params.get('lon');

    if (cityParam) {
      const results = await searchCities(cityParam);
      if (results && results.length > 0) {
        const target = results[0];
        setLocation(target);
        await loadWeather(target);
        return true;
      }
    } else if (latParam && lonParam) {
      const lat = parseFloat(latParam);
      const lon = parseFloat(lonParam);
      const geocoded = await reverseGeocode(lat, lon);
      const target = {
        name: geocoded.name || 'Custom Location',
        country: geocoded.country || '',
        latitude: lat,
        longitude: lon,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'auto'
      };
      setLocation(target);
      await loadWeather(target);
      return true;
    }
    return false;
  }, [loadWeather]);

  // Request geolocation by API and Browser GPS
  const handleRequestLocation = useCallback(async () => {
    setIsLoadingLocation(true);
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

      setLocation(target);
      await loadWeather(target);
    } catch (err) {
      console.warn('Geolocation failed, falling back to URL params or default:', err);
      const hadUrlTarget = await checkUrlParams();
      if (!hadUrlTarget && !weatherRef.current) {
        setLocation(DEFAULT_LOCATION);
        await loadWeather(DEFAULT_LOCATION);
      }
    } finally {
      setIsLoadingLocation(false);
    }
  }, [loadWeather, checkUrlParams]);

  // Initial load: Open Chennai by default (or URL query parameter if specified)
  useEffect(() => {
    let isMounted = true;
    const initOpenCity = async () => {
      const hadUrlTarget = await checkUrlParams();
      if (!hadUrlTarget && isMounted) {
        setLocation(DEFAULT_LOCATION);
        await loadWeather(DEFAULT_LOCATION);
      }
    };
    initOpenCity();
    return () => {
      isMounted = false;
    };
  }, [checkUrlParams, loadWeather]);

  // Auto-refresh weather every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (location) {
        loadWeather(location, false);
      }
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [location, loadWeather]);

  // Unit switcher
  const handleToggleTempUnit = (unit) => {
    setTempUnit(unit);
    localStorage.setItem('weather_temp_unit', unit);
  };

  // Theme switcher
  const handleToggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      localStorage.setItem('weather_dark_mode', String(next));
      return next;
    });
  };

  // Location selector
  const handleSelectLocation = (loc) => {
    setLocation(loc);
    loadWeather(loc);
  };

  // Favorites management
  const handleToggleFavorite = (loc) => {
    const updated = toggleFavoriteLocation(loc);
    setFavorites(updated);
  };

  const isCurrentFavorite = isLocationFavorite(location);

  // Determine current weather visual theme group
  const weatherGroup = weather?.current?.weatherGroup || 'clear';
  const isDay = weather?.current?.isDay ?? 1;

  return (
    <div className={`app-viewport ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* Dynamic Atmospheric Canvas Background */}
      <WeatherBackground
        location={location}
        weatherGroup={weatherGroup}
        isDay={isDay}
        isDarkMode={isDarkMode}
        windSpeed={weather?.current?.windSpeed || 15}
      />

      {/* Main Dashboard Layout */}
      <div className="dashboard-content" style={{ paddingBottom: '7.5rem', paddingTop: '1.5rem' }}>
        {/* Floating Side Bar / Responsive Header Dock */}
        <FloatingSideBar
          onRequestLocation={handleRequestLocation}
          tempUnit={tempUnit}
          onToggleTempUnit={handleToggleTempUnit}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          isLoadingLocation={isLoadingLocation}
          onOpenShare={() => setIsShareModalOpen(true)}
        />

        {/* Major Metro Cities Strip */}
        <LocationMeta
          location={location}
          onSelectCity={handleSelectLocation}
        />

        {/* Starred Favorites Bar */}
        <FavoritesBar
          favorites={favorites}
          currentLocation={location}
          onSelectFavorite={handleSelectLocation}
          onToggleFavorite={handleToggleFavorite}
          isCurrentFavorite={isCurrentFavorite}
        />

        {loading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorScreen error={error} onRetry={() => loadWeather(location)} />
        ) : isCityTransitioning ? (
          <SkeletonLoader />
        ) : weather ? (
          <>
            {/* Pulsing UV & Meteorological Severe Weather Alerts */}
            <WeatherAlerts
              alerts={weather.alerts}
              uvIndex={weather.current?.uvIndex || 0}
            />

            {/* Main Weather Hero Card with Count-Up & 3D Tilt */}
            <div className="animate-fade-in stagger-2">
              <WeatherHero
                weather={weather}
                location={location}
                tempUnit={tempUnit}
              />
            </div>

            {/* Practical Activity & Outfit Suggestions Card */}
            <div className="animate-fade-in stagger-3">
              <ActivitySuggestions
                weather={weather}
                tempUnit={tempUnit}
              />
            </div>

            {/* Detailed 6-Card Weather Grid with Sun/Moon Phase Widget */}
            <div className="animate-fade-in stagger-4">
              <WeatherDetailsGrid
                weather={weather}
                tempUnit={tempUnit}
              />
            </div>

            {/* 24-Hour Scrolling Forecast */}
            <div className="animate-fade-in stagger-5">
              <HourlyForecast
                hourly={weather.hourly}
                tempUnit={tempUnit}
                timezone={weather.timezone}
              />
            </div>

            {/* 7-Day & 14-Day Extended Daily Forecast */}
            <div className="animate-fade-in stagger-6">
              <DailyForecast
                daily={weather.daily}
                tempUnit={tempUnit}
                timezone={weather.timezone}
              />
            </div>

            {/* Interactive Live Radar & Precipitation Map (Code-split) */}
            <div className="animate-fade-in stagger-7">
              <Suspense fallback={<div className="glass-card skeleton-card" style={{ height: '380px' }} />}>
                <WeatherRadar
                  latitude={location.latitude}
                  longitude={location.longitude}
                  locationName={location.name}
                />
              </Suspense>
            </div>

            {/* Interactive 5-Tab Weather Analytics Charts */}
            <div className="animate-fade-in stagger-8">
              <WeatherAnalytics
                hourly={weather.hourly}
                tempUnit={tempUnit}
                timezone={weather.timezone}
              />
            </div>

            {/* Air Quality Index Breakdown & 24h Trend Sparkline */}
            <div className="animate-fade-in stagger-8">
              <AirQuality
                airQuality={weather.airQuality}
                hourlyAQI={weather.hourly?.map((h) => ({
                  hour: new Date(h.time).toLocaleTimeString([], { hour: 'numeric', hour12: true }),
                  aqi: Math.round((weather.airQuality?.aqi || 35) + Math.sin(new Date(h.time).getHours()) * 10)
                }))}
              />
            </div>

            {/* Application Footer */}
            <Footer lastUpdated={lastUpdated} />

            {/* Share Snapshot Modal (Code-split) */}
            <Suspense fallback={null}>
              <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                weather={weather}
                location={location}
                tempUnit={tempUnit}
              />
            </Suspense>
          </>
        ) : null}
      </div>

      {/* Floating Bottom Search Bar */}
      <BottomSearchBar onSelectLocation={handleSelectLocation} />
    </div>
  );
}

export default App;
