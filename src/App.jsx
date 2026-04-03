import { useState } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import AQICard from "./components/AQICard";
import ThemeToggle from "./components/ThemeToggle";
import Loader from "./components/Loader";
import { fetchWeatherByCity, fetchForecast, fetchAirQuality } from "./services/api";

export default function App() {
  const [weather, setWeather]   = useState(null);
  const [forecast, setForecast] = useState(null);
  const [aqi, setAqi]           = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSearch = async (city) => {
    setLoading(true);
    setError("");
    setWeather(null);
    setForecast(null);
    setAqi(null);
    try {
      const [w, f, a] = await Promise.all([
        fetchWeatherByCity(city),
        fetchForecast(city),
        fetchAirQuality(city),
      ]);
      setWeather(w);
      setForecast(f);
      setAqi(a);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="aurora" />
      <div className="container">
        <header className="app-header">
          <ThemeToggle />
          <h1 className="app-title">Nimbus</h1>
          <p className="app-subtitle">Real-time weather, beautifully displayed</p>
        </header>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {loading && <Loader />}

        {error && (
          <div className="error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        {weather && !loading && (
          <>
            <WeatherCard weather={weather} forecast={forecast} />
            <AQICard aqi={aqi} />
          </>
        )}

        {!weather && !loading && !error && (
          <p className="hint">Search for any city to get started</p>
        )}
      </div>
    </div>
  );
}