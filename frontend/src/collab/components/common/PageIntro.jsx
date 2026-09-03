export default function PageIntro({ title, subtitle, action }) {
  return (
    <div className="page-intro">
      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
      {action && <button className="primary-button">{action}</button>}
    </div>
  );
}
