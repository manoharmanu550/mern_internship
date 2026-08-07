import { useEffect, useState } from "react";
import API from "../services/api";
import StatCard from "../components/StatCard";
import "../styles/Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    posts: 0,
    likes: 0,
    bookmarks: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.get("/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats({
  posts: res.data.totalPosts || 0,
  likes: res.data.totalLikes || 0,
  bookmarks: res.data.totalBookmarks || 0,
});
    } catch (error) {
      console.error("Dashboard Error:", error);

      if (error.response?.status === 401) {
        alert("Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <h2 style={{ textAlign: "center" }}>
          Loading Dashboard...
        </h2>
      </div>
    );
  }

  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h1>📊 Dashboard</h1>
        <p>Track your blogging activity</p>
      </div>

      <div className="stats-grid">

        <StatCard
          title="Posts"
          value={stats.posts}
          color="linear-gradient(135deg,#3b82f6,#0ea5e9)"
        />

        <StatCard
          title="Likes"
          value={stats.likes}
          color="linear-gradient(135deg,#10b981,#14b8a6)"
        />

        <StatCard
          title="Bookmarks"
          value={stats.bookmarks}
          color="linear-gradient(135deg,#f59e0b,#fbbf24)"
        />

      </div>

    </div>
  );
}

export default Dashboard;