export default function WeeklyActivity() {
  const activity = [55, 72, 48, 86, 65, 92, 70];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h3>Weekly Activity</h3>
          <p>Your study consistency</p>
        </div>
      </div>

      <div className="activity-chart">
        {activity.map((value, i) => (
          <div className="bar-wrap" key={i}>
            <div className="bar" style={{ height: `${value}%` }} />
            <span>{days[i]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
