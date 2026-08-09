function StatCard({ title, value, color }) {
  return (
    <div
      className="stat-card"
      style={{
        background: color,
      }}
    >
      <h2>{title}</h2>

      <p>{value}</p>
    </div>
  );
}

export default StatCard;