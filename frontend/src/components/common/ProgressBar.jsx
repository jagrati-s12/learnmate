export default function ProgressBar({ value, color = "purple" }) {
  return (
    <div className="progress-track">
      <div className={`progress-fill ${color}`} style={{ width: `${value}%` }} />
    </div>
  );
}
