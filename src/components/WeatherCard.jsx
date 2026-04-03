const ICON_URL = (code) => `https://openweathermap.org/img/wn/${code}@2x.png`;

const formatTime = (unix) =>
  unix ? new Date(unix * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

const getDayName = (unix, i) => {
  if (i === 0) return "Today";
  if (i === 1) return "Tomorrow";
  return new Date(unix * 1000).toLocaleDateString([], { weekday: "long" });
};

export default function WeatherCard({ weather, forecast }) {
  const { name, sys, main, weather: w, wind, visibility } = weather;
  const condition = w[0];

  return (
    <div className="card-wrapper">
      {/* Main Card */}
      <div className="weather-card">
        <div className="card-header">
          <div>
            <h2 className="city-name">{name}, <span>{sys.country}</span></h2>
            <p className="condition-label">{condition.description}</p>
          </div>
          <img
            className="condition-icon"
            src={ICON_URL(condition.icon)}
            alt={condition.description}
          />
        </div>

        <div className="temp-display">
          <span className="temp-main">{Math.round(main.temp)}°</span>
          <span className="temp-unit">C</span>
        </div>

        <div className="temp-range">
          <span>↑ {Math.round(main.temp_max)}°</span>
          <span>↓ {Math.round(main.temp_min)}°</span>
          <span>Feels {Math.round(main.feels_like)}°</span>
        </div>

        <div className="stats-grid">
          <Stat label="Humidity"   value={`${main.humidity}%`}                        icon="💧" />
          <Stat label="Wind"       value={`${Math.round(wind.speed)} m/s`}            icon="💨" />
          <Stat label="Visibility" value={`${(visibility / 1000).toFixed(1)} km`}     icon="👁" />
          <Stat label="Pressure"   value={`${Math.round(main.pressure)} hPa`}         icon="🌡" />
        </div>

        <div className="sun-times">
          <span>🌅 {formatTime(sys.sunrise)}</span>
          <div className="sun-divider" />
          <span>🌇 {formatTime(sys.sunset)}</span>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {forecast && (
        <div className="forecast-section">
          <h3 className="forecast-heading">7-Day Forecast</h3>
          <div className="forecast-list">
            {forecast.list.map((item, i) => (
              <div key={i} className="forecast-row" style={{ animationDelay: `${i * 0.06}s` }}>
                <span className="forecast-day">{getDayName(item.dt, i)}</span>
                <img
                  src={ICON_URL(item.weather[0].icon)}
                  alt={item.weather[0].description}
                  className="forecast-row-icon"
                />
                <span className="forecast-desc">{item.weather[0].description}</span>
                {item.precipitation != null && (
                  <span className="forecast-precip">💧 {item.precipitation}%</span>
                )}
                <div className="forecast-temps">
                  <span className="temp-hi">↑{Math.round(item.main.temp_max)}°</span>
                  <span className="temp-lo">↓{Math.round(item.main.temp_min)}°</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="stat-item">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}