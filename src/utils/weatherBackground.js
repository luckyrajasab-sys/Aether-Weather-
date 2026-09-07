// Real-time place photography resolver with weather condition fallback

// Curated high-resolution landmark photography
// User-provided photos strictly cover the major cities on the home page (Mumbai, Ahmedabad, Jaipur, Hyderabad, Pune)
export const REALTIME_PLACE_PHOTOS = {
  // 1. Mumbai — Bandra-Worli Sea Link (User's Photo)
  mumbai: {
    day: '/images/landmarks/mumbai_sea_link.jpg',
    night: '/images/landmarks/mumbai_sea_link.jpg',
    title: 'Bandra-Worli Sea Link, Mumbai'
  },
  bandra: {
    day: '/images/landmarks/mumbai_sea_link.jpg',
    night: '/images/landmarks/mumbai_sea_link.jpg',
    title: 'Bandra-Worli Sea Link, Mumbai'
  },

  // 2. Ahmedabad — Atal Foot Bridge & Sabarmati Riverfront (User's Photo)
  ahmedabad: {
    day: '/images/landmarks/ahmedabad_atal_bridge.jpg',
    night: '/images/landmarks/ahmedabad_atal_bridge.jpg',
    title: 'Atal Foot Bridge & Sabarmati Riverfront, Ahmedabad'
  },
  sabarmati: {
    day: '/images/landmarks/ahmedabad_atal_bridge.jpg',
    night: '/images/landmarks/ahmedabad_atal_bridge.jpg',
    title: 'Sabarmati Riverfront & Atal Foot Bridge'
  },

  // 3. Jaipur — Jal Mahal Water Palace in Man Sagar Lake (User's Photo)
  jaipur: {
    day: '/images/landmarks/jaipur_jal_mahal.jpg',
    night: '/images/landmarks/jaipur_jal_mahal.jpg',
    title: 'Jal Mahal Water Palace & Lake, Jaipur'
  },
  'jal mahal': {
    day: '/images/landmarks/jaipur_jal_mahal.jpg',
    night: '/images/landmarks/jaipur_jal_mahal.jpg',
    title: 'Jal Mahal Palace, Jaipur'
  },

  // 4. Hyderabad — Charminar & Illuminated Night Market (User's Photo)
  hyderabad: {
    day: '/images/landmarks/hyderabad_charminar.jpg',
    night: '/images/landmarks/hyderabad_charminar.jpg',
    title: 'Charminar & Night Bazaar, Hyderabad'
  },
  charminar: {
    day: '/images/landmarks/hyderabad_charminar.jpg',
    night: '/images/landmarks/hyderabad_charminar.jpg',
    title: 'Charminar Monument, Hyderabad'
  },

  // 5. Pune — Urban Cityscape & Skyline (User's Photo)
  pune: {
    day: '/images/landmarks/pune_cityscape.jpg',
    night: '/images/landmarks/pune_cityscape.jpg',
    title: 'Urban Cityscape Skyline, Pune'
  },

  // Other individual cities have their own distinct authentic landmark photography
  chennai: {
    day: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1616843413587-9e3a37f7bbd8?auto=format&fit=crop&w=2400&q=85',
    title: 'Marina Shoreline, Chennai'
  },
  'new delhi': {
    day: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1597042780496-c146e2996917?auto=format&fit=crop&w=2400&q=85',
    title: 'India Gate, New Delhi'
  },
  delhi: {
    day: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1597042780496-c146e2996917?auto=format&fit=crop&w=2400&q=85',
    title: 'India Gate, Delhi'
  },
  bengaluru: {
    day: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2400&q=85',
    title: 'Vidhana Soudha, Bengaluru'
  },
  bangalore: {
    day: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=2400&q=85',
    title: 'Vidhana Soudha, Bengaluru'
  },
  kolkata: {
    day: 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1534008757030-27299c4371b6?auto=format&fit=crop&w=2400&q=85',
    title: 'Howrah Bridge, Kolkata'
  },
  kochi: {
    day: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=85',
    title: 'Fort Kochi Fishing Nets'
  },
  agra: {
    day: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2400&q=85',
    title: 'Taj Mahal, Agra'
  },
  varanasi: {
    day: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=2400&q=85',
    title: 'Ganges Ghats, Varanasi'
  },
  srinagar: {
    day: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2400&q=85',
    title: 'Dal Lake, Srinagar'
  },
  goa: {
    day: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2400&q=85',
    title: 'Palolem Beach, Goa'
  },
  ooty: {
    day: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2400&q=85',
    title: 'Nilgiris Tea Hills, Ooty'
  },
  amritsar: {
    day: 'https://images.unsplash.com/photo-1588096344356-9a4d8c6b29d4?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1588096344356-9a4d8c6b29d4?auto=format&fit=crop&w=2400&q=85',
    title: 'Golden Temple, Amritsar'
  },
  madurai: {
    day: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=2400&q=85',
    title: 'Meenakshi Temple, Madurai'
  },
  coimbatore: {
    day: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=2400&q=85',
    title: 'Adiyogi & Foothills, Coimbatore'
  },
  tokyo: {
    day: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=2400&q=85',
    title: 'Tokyo Tower, Japan'
  },
  london: {
    day: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=2400&q=85',
    title: 'Big Ben & River Thames, London'
  },
  'new york': {
    day: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=2400&q=85',
    title: 'Manhattan Skyline, New York'
  },
  paris: {
    day: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1509299349698-dd22323b5963?auto=format&fit=crop&w=2400&q=85',
    title: 'Eiffel Tower, Paris'
  },
  dubai: {
    day: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2400&q=85',
    night: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=2400&q=85',
    title: 'Burj Khalifa, Dubai'
  }
};

// Weather Condition Fallback Backgrounds
export const WEATHER_BACKGROUNDS = {
  clear: {
    heroImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=2400&q=85',
    title: 'Taj Mahal, Agra, India',
    tagline: 'Bright & Radiant Sunlight'
  },
  night: {
    heroImage: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=2400&q=85',
    title: 'Marine Drive Skyline, Mumbai, India',
    tagline: 'Clear Night Sky'
  },
  cloudy: {
    heroImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=2400&q=85',
    title: 'Tea Hills of Munnar & Nilgiris, India',
    tagline: 'Soft Rolling Overcast Clouds'
  },
  rain: {
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=2400&q=85',
    title: 'Kerala Backwaters & Ghats, India',
    tagline: 'Fresh Monsoon Showers'
  },
  storm: {
    heroImage: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=2400&q=85',
    title: 'Bay of Bengal Coastline, India',
    tagline: 'Dramatic Monsoon Thunderstorm'
  },
  snow: {
    heroImage: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2400&q=85',
    title: 'Gulmarg & Pir Panjal Range, Kashmir, India',
    tagline: 'Pristine Himalayan Snowscapes'
  },
  fog: {
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=2400&q=85',
    title: 'Ganges Ghats, Varanasi, India',
    tagline: 'Mystical Morning Mist'
  }
};

/**
 * Returns a real-time place photo matching the active location, with weather condition fallback
 */
export const getBackgroundMeta = (location, weatherGroup = 'clear', isDay = 1) => {
  const cityName = (location?.name || '').toLowerCase().trim();

  // 1. Direct city match in place photos
  if (REALTIME_PLACE_PHOTOS[cityName]) {
    const place = REALTIME_PLACE_PHOTOS[cityName];
    const image = !isDay ? place.night : place.day;
    return {
      heroImage: image,
      title: place.title,
      tagline: isDay ? 'Daylight Telemetry' : 'Night Horizon'
    };
  }

  // 2. Partial match check
  for (const [key, place] of Object.entries(REALTIME_PLACE_PHOTOS)) {
    if (cityName.includes(key) || key.includes(cityName)) {
      const image = !isDay ? place.night : place.day;
      return {
        heroImage: image,
        title: place.title,
        tagline: isDay ? 'Daylight Telemetry' : 'Night Horizon'
      };
    }
  }

  // 3. Fallback based on condition & day/night
  if (!isDay && weatherGroup === 'clear') {
    return WEATHER_BACKGROUNDS.night;
  }
  return WEATHER_BACKGROUNDS[weatherGroup] || WEATHER_BACKGROUNDS.clear;
};
