const getAQILevel = (aqi) => {
  if (aqi <= 20)  return { label: "Good",            color: "#4ade80", bg: "rgba(74,222,128,0.1)"  };
  if (aqi <= 40)  return { label: "Fair",            color: "#a3e635", bg: "rgba(163,230,53,0.1)"  };
  if (aqi <= 60)  return { label: "Moderate",        color: "#facc15", bg: "rgba(250,204,21,0.1)"  };
  if (aqi <= 80)  return { label: "Poor",            color: "#fb923c", bg: "rgba(251,146,60,0.1)"  };
  if (aqi <= 100) return { label: "Very Poor",       color: "#f87171", bg: "rgba(248,113,113,0.1)" };
  return           { label: "Extremely Poor",        color: "#c084fc", bg: "rgba(192,132,252,0.1)" };
};

const Pollutant = ({ label, value, unit }) => (
  <div className="pollutant-item">
    <span className="pollutant-label">{label}</span>
    <span className="pollutant-value">{value != null ? `${value.toFixed(1)} ${unit}` : "N/A"}</span>
  </div>
);

export default function AQICard({ aqi }) {
  if (!aqi) return null;

  const level = getAQILevel(aqi.european_aqi);
  const pct = Math.min((aqi.european_aqi / 120) * 100, 100);

  return (
    <div className="aqi-card" style={{ borderColor: `${level.color}30`, background: level.bg }}>
      <div className="aqi-header">
        <span className="aqi-title">🌬 Air Quality</span>
        <span className="aqi-badge" style={{ background: level.color, color: "#050d1a" }}>
          {level.label}
        </span>
      </div>

      <div className="aqi-score-row">
        <span className="aqi-score" style={{ color: level.color }}>
          {aqi.european_aqi}
        </span>
        <span className="aqi-score-label">European AQI</span>
      </div>

      {/* Progress bar */}
      <div className="aqi-bar-track">
        <div
          className="aqi-bar-fill"
          style={{ width: `${pct}%`, background: level.color }}
        />
      </div>
      <div className="aqi-bar-labels">
        <span>Good</span><span>Moderate</span><span>Very Poor</span>
      </div>

      {/* Pollutants */}
      <div className="pollutants-grid">
        <Pollutant label="PM2.5"  value={aqi.pm2_5}             unit="μg/m³" />
        <Pollutant label="PM10"   value={aqi.pm10}              unit="μg/m³" />
        <Pollutant label="NO₂"    value={aqi.nitrogen_dioxide}  unit="μg/m³" />
        <Pollutant label="O₃"     value={aqi.ozone}             unit="μg/m³" />
        <Pollutant label="CO"     value={aqi.carbon_monoxide}   unit="μg/m³" />
      </div>
    </div>
  );
}