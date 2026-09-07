// Location service supporting IP/Network API Geolocation, Google Geolocation API, and Major/Capital Cities presets

export const DEFAULT_LOCATION = {
  name: 'Chennai',
  country: 'India',
  country_code: 'IN',
  admin1: 'Tamil Nadu',
  latitude: 13.0827,
  longitude: 80.2707,
  timezone: 'Asia/Kolkata'
};

// Top 10 Home Page Major Cities
export const POPULAR_LOCATIONS = [
  { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
  { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
  { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
  { name: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
  { name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
  { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
  { name: 'New Delhi', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
  { name: 'Bengaluru', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
  { name: 'Kolkata', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
  { name: 'Kochi', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' }
];

// Comprehensive Extended Categories of State Capitals and Popular Metros
export const EXTENDED_CITIES_BY_CATEGORY = [
  {
    category: '🇮🇳 State Capitals & National Metros',
    cities: [
      { name: 'New Delhi', tag: 'National Capital', country: 'India', latitude: 28.6139, longitude: 77.2090, timezone: 'Asia/Kolkata' },
      { name: 'Mumbai', tag: 'Maharashtra', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
      { name: 'Bengaluru', tag: 'Karnataka', country: 'India', latitude: 12.9716, longitude: 77.5946, timezone: 'Asia/Kolkata' },
      { name: 'Chennai', tag: 'Tamil Nadu', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
      { name: 'Hyderabad', tag: 'Telangana', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
      { name: 'Kolkata', tag: 'West Bengal', country: 'India', latitude: 22.5726, longitude: 88.3639, timezone: 'Asia/Kolkata' },
      { name: 'Jaipur', tag: 'Rajasthan', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
      { name: 'Gandhinagar', tag: 'Gujarat Capital', country: 'India', latitude: 23.2156, longitude: 72.6369, timezone: 'Asia/Kolkata' },
      { name: 'Lucknow', tag: 'Uttar Pradesh', country: 'India', latitude: 26.8467, longitude: 80.9462, timezone: 'Asia/Kolkata' },
      { name: 'Bhopal', tag: 'Madhya Pradesh', country: 'India', latitude: 23.2599, longitude: 77.4126, timezone: 'Asia/Kolkata' },
      { name: 'Patna', tag: 'Bihar', country: 'India', latitude: 25.5941, longitude: 85.1376, timezone: 'Asia/Kolkata' },
      { name: 'Chandigarh', tag: 'Punjab / Haryana', country: 'India', latitude: 30.7333, longitude: 76.7794, timezone: 'Asia/Kolkata' },
      { name: 'Bhubaneswar', tag: 'Odisha', country: 'India', latitude: 20.2961, longitude: 85.8245, timezone: 'Asia/Kolkata' },
      { name: 'Thiruvananthapuram', tag: 'Kerala', country: 'India', latitude: 8.5241, longitude: 76.9366, timezone: 'Asia/Kolkata' },
      { name: 'Dehradun', tag: 'Uttarakhand', country: 'India', latitude: 30.3165, longitude: 78.0322, timezone: 'Asia/Kolkata' },
      { name: 'Shimla', tag: 'Himachal Pradesh', country: 'India', latitude: 31.1048, longitude: 77.1734, timezone: 'Asia/Kolkata' },
      { name: 'Srinagar', tag: 'Jammu & Kashmir', country: 'India', latitude: 34.0837, longitude: 74.7973, timezone: 'Asia/Kolkata' },
      { name: 'Panaji', tag: 'Goa Capital', country: 'India', latitude: 15.4909, longitude: 73.8278, timezone: 'Asia/Kolkata' },
      { name: 'Ranchi', tag: 'Jharkhand', country: 'India', latitude: 23.3441, longitude: 85.3096, timezone: 'Asia/Kolkata' },
      { name: 'Raipur', tag: 'Chhattisgarh', country: 'India', latitude: 21.2514, longitude: 81.6296, timezone: 'Asia/Kolkata' },
      { name: 'Guwahati', tag: 'Assam Gateway', country: 'India', latitude: 26.1445, longitude: 91.7362, timezone: 'Asia/Kolkata' }
    ]
  },
  {
    category: '⭐ Top Popular Economic & Cultural Hubs',
    cities: [
      { name: 'Ahmedabad', tag: 'Gujarat Mega City', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
      { name: 'Pune', tag: 'Maharashtra Hub', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' },
      { name: 'Kochi', tag: 'Kerala Port', country: 'India', latitude: 9.9312, longitude: 76.2673, timezone: 'Asia/Kolkata' },
      { name: 'Surat', tag: 'Gujarat', country: 'India', latitude: 21.1702, longitude: 72.8311, timezone: 'Asia/Kolkata' },
      { name: 'Indore', tag: 'Madhya Pradesh', country: 'India', latitude: 22.7196, longitude: 75.8577, timezone: 'Asia/Kolkata' },
      { name: 'Varanasi', tag: 'Uttar Pradesh', country: 'India', latitude: 25.3176, longitude: 82.9739, timezone: 'Asia/Kolkata' },
      { name: 'Agra', tag: 'Uttar Pradesh', country: 'India', latitude: 27.1767, longitude: 78.0081, timezone: 'Asia/Kolkata' },
      { name: 'Amritsar', tag: 'Punjab', country: 'India', latitude: 31.6340, longitude: 74.8723, timezone: 'Asia/Kolkata' },
      { name: 'Coimbatore', tag: 'Tamil Nadu', country: 'India', latitude: 11.0168, longitude: 76.9558, timezone: 'Asia/Kolkata' },
      { name: 'Madurai', tag: 'Tamil Nadu', country: 'India', latitude: 9.9252, longitude: 78.1198, timezone: 'Asia/Kolkata' },
      { name: 'Visakhapatnam', tag: 'Andhra Pradesh', country: 'India', latitude: 17.6868, longitude: 83.2185, timezone: 'Asia/Kolkata' },
      { name: 'Goa', tag: 'Coastal Tourism', country: 'India', latitude: 15.2993, longitude: 74.1240, timezone: 'Asia/Kolkata' },
      { name: 'Ooty', tag: 'Nilgiris Hills', country: 'India', latitude: 11.4102, longitude: 76.6950, timezone: 'Asia/Kolkata' }
    ]
  },
  {
    category: '🌐 World Capitals & Global Metros',
    cities: [
      { name: 'Tokyo', tag: 'Japan Capital', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
      { name: 'London', tag: 'United Kingdom', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
      { name: 'Paris', tag: 'France Capital', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
      { name: 'New York', tag: 'United States', country: 'United States', latitude: 40.7128, longitude: -74.0060, timezone: 'America/New_York' },
      { name: 'Dubai', tag: 'United Arab Emirates', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, timezone: 'Asia/Dubai' },
      { name: 'Singapore', tag: 'Singapore', country: 'Singapore', latitude: 1.3521, longitude: 103.8198, timezone: 'Asia/Singapore' }
    ]
  }
];

/**
 * Detects location by IP / Network Geolocation API
 */
export const getLocationByIpApi = async () => {
  try {
    const res = await fetch('https://ipwho.is/');
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.latitude && data.longitude) {
        return {
          name: data.city || data.region || 'My Location',
          country: data.country || 'India',
          country_code: data.country_code || 'IN',
          admin1: data.region || '',
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone?.id || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
        };
      }
    }
  } catch (err) {
    console.warn('ipwho.is failed, trying secondary IP API:', err);
  }

  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return {
          name: data.city || data.region || 'My Location',
          country: data.country_name || 'India',
          country_code: data.country_code || 'IN',
          admin1: data.region || '',
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
        };
      }
    }
  } catch (err) {
    console.warn('ipapi.co failed:', err);
  }

  throw new Error('Could not retrieve location from IP APIs');
};

/**
 * Detects location by Google Maps Geolocation API
 */
export const getLocationByGoogleApi = async (apiKey) => {
  const key = apiKey || localStorage.getItem('google_maps_api_key') || import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error('No Google Maps API Key found');

  const res = await fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ considerIp: true })
  });

  if (!res.ok) throw new Error(`Google Geolocation API failed: ${res.status}`);
  const data = await res.json();

  if (data.location?.lat && data.location?.lng) {
    return {
      latitude: data.location.lat,
      longitude: data.location.lng,
      accuracy: data.accuracy
    };
  }
  throw new Error('Invalid response from Google Geolocation API');
};

/**
 * Browser HTML5 GPS Geolocation
 */
export const getBrowserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000
      }
    );
  });
};

/**
 * Master multi-strategy Location Resolver
 */
export const detectCurrentLocation = async () => {
  try {
    const coords = await getBrowserLocation();
    return {
      type: 'gps',
      latitude: coords.latitude,
      longitude: coords.longitude
    };
  } catch (err) {
    console.warn('Browser GPS unavailable, falling back to API geolocation:', err);
  }

  try {
    const coords = await getLocationByGoogleApi();
    return {
      type: 'google_api',
      latitude: coords.latitude,
      longitude: coords.longitude
    };
  } catch (err) {
    console.warn('Google API geolocation skipped/failed, using IP API:', err);
  }

  return await getLocationByIpApi();
};

export const getRecentSearches = () => {
  try {
    const data = localStorage.getItem('weather_recent_searches');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

export const saveRecentSearch = (location) => {
  if (!location || !location.name) return;
  try {
    const list = getRecentSearches();
    const filtered = list.filter(
      (item) =>
        item.name.toLowerCase() !== location.name.toLowerCase() ||
        (item.country && location.country && item.country !== location.country)
    );
    const updated = [location, ...filtered].slice(0, 6);
    localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save recent search', err);
  }
};

export const getFavorites = () => {
  try {
    const data = localStorage.getItem('weather_favorites');
    return data ? JSON.parse(data) : [
      { name: 'Chennai', country: 'India', latitude: 13.0827, longitude: 80.2707, timezone: 'Asia/Kolkata' },
      { name: 'Mumbai', country: 'India', latitude: 19.0760, longitude: 72.8777, timezone: 'Asia/Kolkata' },
      { name: 'Ahmedabad', country: 'India', latitude: 23.0225, longitude: 72.5714, timezone: 'Asia/Kolkata' },
      { name: 'Jaipur', country: 'India', latitude: 26.9124, longitude: 75.7873, timezone: 'Asia/Kolkata' },
      { name: 'Hyderabad', country: 'India', latitude: 17.3850, longitude: 78.4867, timezone: 'Asia/Kolkata' },
      { name: 'Pune', country: 'India', latitude: 18.5204, longitude: 73.8567, timezone: 'Asia/Kolkata' }
    ];
  } catch {
    return [];
  }
};

export const toggleFavoriteLocation = (location) => {
  if (!location || !location.name) return [];
  try {
    const favs = getFavorites();
    const exists = favs.some((f) => f.name.toLowerCase() === location.name.toLowerCase());
    let updated;
    if (exists) {
      updated = favs.filter((f) => f.name.toLowerCase() !== location.name.toLowerCase());
    } else {
      updated = [...favs, location];
    }
    localStorage.setItem('weather_favorites', JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to toggle favorite', err);
    return [];
  }
};

export const isLocationFavorite = (location) => {
  if (!location || !location.name) return false;
  const favs = getFavorites();
  return favs.some((f) => f.name.toLowerCase() === location.name.toLowerCase());
};
