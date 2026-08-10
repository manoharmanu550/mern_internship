import { useEffect, useState } from "react";
import API from "../services/api";
import BookmarkCard from "../components/BookmarkCard";
import "../styles/Bookmarks.css";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setBookmarks([]);
        return;
      }

      const response = await API.get("/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Bookmarks API Response:", response.data);

      if (Array.isArray(response.data)) {
        setBookmarks(response.data);
      } else if (Array.isArray(response.data.bookmarks)) {
        setBookmarks(response.data.bookmarks);
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.error("Fetch Bookmarks Error:", err);
      console.error("Response:", err.response);

      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to load bookmarks"
        );
      }

      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  if (loading) {
    return (
      <div className="bookmark-page">
        <h2 className="loading">Loading Bookmarks...</h2>
      </div>
    );
  }

  return (
    <div className="bookmark-page">

      <div className="bookmark-header">
        <span>🔖</span>
        <h1>My Bookmarks</h1>
      </div>

      <p className="bookmark-count">
        Total Bookmarks : {bookmarks.length}
      </p>

      {bookmarks.length === 0 ? (
        <h2 className="no-bookmarks">
          No Bookmarks Found
        </h2>
      ) : (
        <div className="bookmark-grid">
          {bookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark._id}
              bookmark={bookmark}
              refresh={fetchBookmarks}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Bookmarks;