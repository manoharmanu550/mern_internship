import { useEffect, useState } from "react";
import API from "../services/api";
import BookmarkCard from "../components/BookmarkCard";
import "../styles/Bookmarks.css";

function Bookmarks() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await API.get("/bookmarks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (Array.isArray(res.data)) {
        setBookmarks(res.data);
      } else if (Array.isArray(res.data.bookmarks)) {
        setBookmarks(res.data.bookmarks);
      } else {
        setBookmarks([]);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load bookmarks");
    } finally {
      setLoading(false);
    }
  };

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