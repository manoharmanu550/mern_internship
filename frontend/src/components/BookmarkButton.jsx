import { useState } from "react";
import API from "../services/api";

function BookmarkButton({ post }) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (loading) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to bookmark this post.");
      return;
    }

    if (!post?._id) {
      alert("Post ID not found.");
      return;
    }

    try {
      setLoading(true);

      console.log("Saving Bookmark...");
      console.log("Post ID:", post._id);

      const response = await API.post(
        "/bookmarks",
        {
          post: post._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Bookmark Response:", response.data);

      setSaved(true);

      alert("🔖 Bookmark Saved Successfully");
    } catch (err) {
      console.error("Save Bookmark Error:", err);
      console.error("Response:", err.response);

      if (err.response?.status === 400) {
        alert("Already Bookmarked");
        setSaved(true);
      } else if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to Save Bookmark"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={loading || saved}
      style={{
        background: saved ? "#16a34a" : "#2563eb",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor:
          loading || saved ? "not-allowed" : "pointer",
        fontWeight: "600",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading
        ? "Saving..."
        : saved
        ? "✅ Bookmarked"
        : "🔖 Bookmark"}
    </button>
  );
}

export default BookmarkButton;