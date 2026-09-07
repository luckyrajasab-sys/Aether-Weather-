// AI Service for Weather Analysis Chatbot supporting OpenAI, Anthropic, Gemini, and Local Fallback

const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY || '';
const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const CUSTOM_ENDPOINT = import.meta.env.VITE_AI_API_ENDPOINT || '';

/**
 * Builds rich meteorological system context from live weather payload
 */
export const buildWeatherContextPrompt = (weather, location, tempUnit = 'C') => {
  if (!weather || !weather.current) {
    return 'No live weather data currently available.';
  }

  const { current, hourly = [], daily = [], airQuality = {}, alerts = [], timezone } = weather;

  const next12Hours = hourly.slice(0, 12).map((h) => ({
    time: h.time,
    temp: `${Math.round(h.temp)}°${tempUnit}`,
    condition: h.condition,
    rainProb: `${h.precipProb}%`,
    windSpeed: `${Math.round(h.windSpeed)} km/h`
  }));

  const next7Days = daily.slice(0, 7).map((d) => ({
    date: d.date,
    condition: d.condition,
    maxTemp: `${Math.round(d.maxTemp)}°${tempUnit}`,
    minTemp: `${Math.round(d.minTemp)}°${tempUnit}`,
    rainProb: `${d.rainProb}%`
  }));

  return `You are Aether AI, an expert meteorologist and practical weather advisor embedded inside the Aether Weather Pro web app.

LIVE TELEMETRY FOR ${location.name.toUpperCase()}, ${location.country || ''}:
- Current Temperature: ${Math.round(current.temperature)}°${tempUnit} (Feels like ${Math.round(current.apparentTemperature)}°${tempUnit})
- Weather Condition: ${current.condition}
- Humidity: ${Math.round(current.humidity)}% (Dew point: ${current.dewPoint}°${tempUnit})
- Wind: ${Math.round(current.windSpeed)} km/h (Gusts up to ${Math.round(current.windGusts)} km/h)
- UV Index: ${Math.round(current.uvIndex)} / 12
- Atmospheric Pressure: ${Math.round(current.pressure)} hPa
- Air Quality Index (AQI): ${airQuality.aqi || 35} (PM2.5: ${airQuality.pm2_5 || 12} µg/m³, PM10: ${airQuality.pm10 || 24} µg/m³)
- Active Weather Alerts: ${alerts.length > 0 ? alerts.map((a) => `${a.title}: ${a.message}`).join(' | ') : 'None'}

HOURLY TELEMETRY (Next 12 Hours):
${JSON.stringify(next12Hours)}

7-DAY FORECAST:
${JSON.stringify(next7Days)}

INSTRUCTIONS:
1. Answer the user's questions grounded accurately in this live weather data.
2. Provide concise, helpful, and friendly advice (e.g. for outdoor activities, clothing, umbrella need, workout timings, UV safety).
3. Use markdown formatting with bullet points and bold highlights for temperatures and key metrics.
4. Keep answers brief (2-4 paragraphs max) so they fit comfortably in the chat drawer.`;
};

/**
 * Sends chat messages to active LLM provider or smart local fallback
 */
export const sendChatMessage = async ({ messages, weather, location, tempUnit }) => {
  const systemPrompt = buildWeatherContextPrompt(weather, location, tempUnit);

  // 1. OpenAI API
  if (OPENAI_KEY) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.map((m) => ({
              role: m.sender === 'user' ? 'user' : 'assistant',
              content: m.text
            }))
          ],
          temperature: 0.7,
          max_tokens: 600
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || 'Unable to generate response.';
    } catch (err) {
      console.warn('OpenAI error, falling back to local meteorological engine:', err);
    }
  }

  // 2. Anthropic Claude API
  if (ANTHROPIC_KEY) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          system: systemPrompt,
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          max_tokens: 600
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.content[0]?.text || 'Unable to generate response.';
    } catch (err) {
      console.warn('Anthropic error, falling back to local engine:', err);
    }
  }

  // 3. Google Gemini API
  if (GEMINI_KEY) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;
      const contents = [
        {
          role: 'user',
          parts: [{ text: `${systemPrompt}\n\nUser Question: ${messages[messages.length - 1]?.text}` }]
        }
      ];

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate response.';
    } catch (err) {
      console.warn('Gemini error, falling back to local engine:', err);
    }
  }

  // 4. Custom / Proxy API Endpoint
  if (CUSTOM_ENDPOINT) {
    try {
      const response = await fetch(CUSTOM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          messages: messages.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          }))
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.reply || data.text || data.message;
      }
    } catch (err) {
      console.warn('Custom endpoint error, falling back to local engine:', err);
    }
  }

  // 5. Intelligent Local Meteorological Reasoning Engine (Zero API key required!)
  return generateLocalAIResponse(messages[messages.length - 1]?.text || '', weather, location, tempUnit);
};

/**
 * High-precision rule-based local meteorological intelligence
 */
function generateLocalAIResponse(queryText, weather, location, tempUnit) {
  const q = queryText.toLowerCase();
  const { current = {}, hourly = [], daily = [], airQuality = {}, alerts = [] } = weather || {};
  const temp = `${Math.round(current.temperature ?? 22)}°${tempUnit}`;
  const feels = `${Math.round(current.apparentTemperature ?? current.temperature ?? 22)}°${tempUnit}`;
  const cond = current.condition || 'Partly Cloudy';
  const cityName = location?.name || 'your area';

  // Severe alert query
  if (alerts.length > 0 && (q.includes('alert') || q.includes('warning') || q.includes('safe') || q.includes('danger'))) {
    const alertList = alerts.map((a) => `🚨 **${a.title}**: ${a.message} (*Recommendation: ${a.instruction || 'Stay alert'}*)`).join('\n\n');
    return `### Active Weather Warnings for ${cityName}\n\n${alertList}\n\nStay safe and monitor local emergency advisories!`;
  }

  // Umbrella / Rain query
  if (q.includes('umbrella') || q.includes('rain') || q.includes('wet') || q.includes('shower') || q.includes('precipitation')) {
    const maxPrecipProb = Math.max(...hourly.slice(0, 14).map((h) => h.precipProb || 0), 0);
    const rainHours = hourly.slice(0, 12).filter((h) => (h.precipProb || 0) >= 30);

    if (maxPrecipProb >= 50 || (current.precipitation || 0) > 0) {
      return `🌧️ **Yes, keep an umbrella handy!**\n\n` +
        `There is an active **${maxPrecipProb}% chance of rain** in ${cityName} today.\n\n` +
        `• **Current Precipitation**: ${current.precipitation || 0} mm\n` +
        `• **Peak Rain Window**: ${rainHours.length > 0 ? rainHours.map((h) => h.time.split('T')[1]?.slice(0, 5)).slice(0, 3).join(', ') : 'Throughout the day'}\n\n` +
        `Carry a waterproof jacket and tread carefully on wet surfaces.`;
    } else if (maxPrecipProb >= 25) {
      return `🌂 **Consider carrying a compact umbrella.**\n\n` +
        `There is a moderate **${maxPrecipProb}% probability of isolated showers** in ${cityName}, though substantial dry intervals are expected.`;
    } else {
      return `☀️ **No umbrella needed today!**\n\n` +
        `Skies are **${cond.toLowerCase()}** with only a negligible **${maxPrecipProb}% rain probability** in ${cityName}. Enjoy the clear weather!`;
    }
  }

  // Bike / Cycling / Running / Outdoor Workout
  if (q.includes('bike') || q.includes('ride') || q.includes('run') || q.includes('workout') || q.includes('cycling') || q.includes('exercise') || q.includes('outdoor')) {
    const isRaining = (current.precipitation || 0) > 0 || (hourly[0]?.precipProb || 0) > 40;
    const isHighWind = (current.windSpeed || 0) > 35;
    const isHot = (current.temperature || 0) > 33;
    const aqi = airQuality.aqi || 40;

    let status = '✅ **Excellent conditions for outdoor workouts!**';
    let safetyNotes = [];

    if (isRaining) {
      status = '⚠️ **Outdoor ride/run not recommended right now due to rain & wet roads.**';
      safetyNotes.push('Slippery asphalt and reduced visibility.');
    }
    if (isHighWind) {
      safetyNotes.push(`Gusty winds up to ${Math.round(current.windGusts || current.windSpeed)} km/h.`);
    }
    if (isHot) {
      safetyNotes.push('High thermal index: hydrate heavily and stay in the shade.');
    }
    if (aqi > 100) {
      safetyNotes.push(`Elevated AQI (${aqi}): sensitive individuals should exercise indoors.`);
    }

    return `${status}\n\n` +
      `**Current Metrics in ${cityName}:**\n` +
      `• **Temperature**: ${temp} (Feels like ${feels})\n` +
      `• **Wind**: ${Math.round(current.windSpeed)} km/h\n` +
      `• **Air Quality**: ${aqi} AQI (${aqi <= 50 ? 'Good' : aqi <= 100 ? 'Moderate' : 'Unhealthy'})\n\n` +
      (safetyNotes.length > 0 ? `**Safety Advisory:**\n${safetyNotes.map((n) => `• ${n}`).join('\n')}` : `Optimal morning and evening comfort.`);
  }

  // Outfit / What to wear
  if (q.includes('wear') || q.includes('outfit') || q.includes('jacket') || q.includes('clothes') || q.includes('dress') || q.includes('clothing')) {
    const cTemp = current.temperature ?? 22;
    let recommendation = '';

    if (cTemp >= 28) {
      recommendation = `• **Top**: Lightweight breathable cotton or linen t-shirt\n• **Bottom**: Shorts or light airy trousers\n• **Accessories**: UV400 Sunglasses & SPF 50 sunscreen\n• **Hydration**: Carry a chilled water bottle`;
    } else if (cTemp >= 19) {
      recommendation = `• **Top**: Comfortable casual shirt or t-shirt\n• **Bottom**: Chinos, jeans, or casual pants\n• **Layer**: Optional light overshirt or cardigan for cooler evenings`;
    } else if (cTemp >= 12) {
      recommendation = `• **Top**: Long-sleeve shirt or light knit sweater\n• **Layer**: Windbreaker or casual denim jacket\n• **Bottom**: Full-length pants`;
    } else {
      recommendation = `• **Top**: Thermal base layer + heavy fleece or down jacket\n• **Accessories**: Beanie, scarf, and insulated gloves`;
    }

    return `👗 **Outfit Recommendation for ${cityName} (${temp}):**\n\n${recommendation}\n\n` +
      ((current.precipitation || 0) > 0 ? `⚠️ *Pack a raincoat or waterproof outer layer.*` : `Ideal for current ${cond.toLowerCase()} conditions.`);
  }

  // 7-Day & Weekend Outlook
  if (q.includes('tomorrow') || q.includes('weekend') || q.includes('forecast') || q.includes('future') || q.includes('week')) {
    const nextDays = daily.slice(1, 4);
    const rows = nextDays.map((d) => {
      const dateName = new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
      return `• **${dateName}**: ${d.condition} | High: **${Math.round(d.maxTemp)}°${tempUnit}**, Low: **${Math.round(d.minTemp)}°${tempUnit}** (Rain: ${d.rainProb}%)`;
    }).join('\n');

    return `📅 **Upcoming Meteorological Outlook for ${cityName}:**\n\n${rows}\n\n` +
      `**Summary:** Anticipate consistent ${daily[1]?.condition?.toLowerCase() || 'seasonal'} trends with moderate temperature fluctuations.`;
  }

  // UV & Air Quality
  if (q.includes('uv') || q.includes('sun') || q.includes('aqi') || q.includes('air') || q.includes('pollution') || q.includes('breathe')) {
    const uv = Math.round(current.uvIndex || 0);
    const aqi = airQuality.aqi || 35;

    return `🍃 **Environmental Telemetry for ${cityName}:**\n\n` +
      `• **UV Radiation**: **${uv} / 12** (${uv < 3 ? 'Low' : uv < 6 ? 'Moderate' : uv < 8 ? 'High' : 'Extreme'})\n` +
      `• **Air Quality Index**: **${aqi} AQI** (PM2.5: ${airQuality.pm2_5 || 12} µg/m³)\n\n` +
      (uv >= 6 ? `☀️ **Sun Alert**: Apply SPF 30+ sunscreen and wear protective eyewear during midday hours.` : `👍 Solar radiation levels are mild.`) + `\n` +
      (aqi > 100 ? `😷 Air quality is elevated; sensitive groups should minimize prolonged exertion.` : `🌿 Clean, breathable ambient air.`);
  }

  // General fallback
  return `🌤️ **Atmospheric Summary for ${cityName}:**\n\n` +
    `• **Condition**: ${cond}\n` +
    `• **Temperature**: ${temp} (Feels like ${feels})\n` +
    `• **Humidity**: ${Math.round(current.humidity)}% | **Wind**: ${Math.round(current.windSpeed)} km/h\n` +
    `• **Max Rain Probability Today**: ${Math.max(...hourly.slice(0, 24).map((h) => h.precipProb || 0), 0)}%\n\n` +
    `Ask me about outdoor activity planning, rain forecasts, or outfit recommendations!`;
}
