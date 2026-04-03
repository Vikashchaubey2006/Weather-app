export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-ring">
        <div /><div /><div /><div />
      </div>
      <p className="loader-text">Fetching weather…</p>
    </div>
  );
}