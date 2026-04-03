const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const getWeatherDescription = (code) => {
  const descriptions = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle",
    55: "Heavy drizzle", 61: "Slight rain", 63: "Rain", 65: "Heavy rain",
    71: "Slight snow", 73: "Snow", 75: "Heavy snow", 80: "Rain showers",
    85: "Snow showers", 95: "Thunderstorm", 99: "Heavy thunderstorm",
  };
  return descriptions[code] || "Unknown";
};

const getWeatherIcon = (code, isDay = 1) => {
  if (code === 0) return isDay ? "01d" : "01n";
  if (code <= 2) return isDay ? "02d" : "02n";
  if (code === 3) return "04d";
  if (code <= 48) return "50d";
  if (code <= 55) return "09d";
  if (code <= 65) return "10d";
  if (code <= 75) return "13d";
  if (code <= 82) return "09d";
  if (code <= 85) return "13d";
  return "11d";
};

export const fetchWeatherByCity = async (city) => {
  const geoRes = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) throw new Error("City not found");

  const { latitude, longitude, name, country_code, timezone } = geoData.results[0];

  const weatherRes = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,surface_pressure,visibility,is_day` +
    `&daily=sunrise,sunset&wind_speed_unit=ms&timezone=${timezone}&forecast_days=1`
  );
  const weatherData = await weatherRes.json();
  const current = weatherData.current;
  const daily = weatherData.daily;

  const sunriseTs = daily?.sunrise?.[0] ? new Date(daily.sunrise[0]).getTime() / 1000 : 0;
  const sunsetTs  = daily?.sunset?.[0]  ? new Date(daily.sunset[0]).getTime()  / 1000 : 0;

  return {
    name,
    sys: {
      country: country_code.toUpperCase(),
      sunrise: sunriseTs,
      sunset: sunsetTs,
    },
    main: {
      temp: current.temperature_2m,
      feels_like: current.apparent_temperature,
      temp_min: current.temperature_2m - 2,
      temp_max: current.temperature_2m + 2,
      humidity: current.relative_humidity_2m,
      pressure: current.surface_pressure,
    },
    weather: [{
      description: getWeatherDescription(current.weather_code),
      icon: getWeatherIcon(current.weather_code, current.is_day),
    }],
    wind: { speed: current.wind_speed_10m },
    visibility: (current.visibility ?? 10) * 1000,
  };
};

export const fetchForecast = async (city) => {
  const geoRes = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const geoData = await geoRes.json();
  if (!geoData.results) return null;

  const { latitude, longitude, timezone } = geoData.results[0];

  const weatherRes = await fetch(
    `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
    `&timezone=${timezone}&forecast_days=7`
  );
  const weatherData = await weatherRes.json();
  const daily = weatherData.daily;

  const list = daily.time.map((time, i) => ({
    dt: new Date(time).getTime() / 1000,
    main: {
      temp: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
    },
    weather: [{
      description: getWeatherDescription(daily.weather_code[i]),
      icon: getWeatherIcon(daily.weather_code[i]),
    }],
    precipitation: daily.precipitation_probability_max[i],
  }));

  return { list };
};

export const fetchAirQuality = async (city) => {
  const geoRes = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
  );
  const geoData = await geoRes.json();
  if (!geoData.results) return null;

  const { latitude, longitude, timezone } = geoData.results[0];

  const aqRes = await fetch(
    `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm2_5,pm10,carbon_monoxide,nitrogen_dioxide,ozone,european_aqi&timezone=${timezone}`
  );
  const aqData = await aqRes.json();
  return aqData.current;
};