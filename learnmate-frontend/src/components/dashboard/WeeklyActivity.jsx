export default function WeeklyActivity() {
  const activity = [55, 72, 48, 86, 65, 92, 70];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <h3>Weekly Study Activity</h3>
          <p>Your SSC JE preparation consistency</p>
        </div>
      </div>

      <div className="activity-chart">
        {activity.map((value, index) => (
          <div className="bar-wrap" key={index}>
            <div className="bar" style={{ height: `${value}%` }} />
            <span>{days[index]}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
