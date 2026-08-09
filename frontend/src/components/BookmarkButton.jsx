    import { useState } from "react";
import API from "../services/api";

function BookmarkButton({ post }) {
  const [saved, setSaved] = useState(false);

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem("token");

      await API.post(
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

      setSaved(true);
      alert("🔖 Bookmark Saved Successfully");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 400) {
        alert("Already Bookmarked");
      } else {
        alert(err.response?.data?.message || "Failed to Save Bookmark");
      }
    }
  };

  return (
    <button
      onClick={handleBookmark}
      style={{
        background: saved ? "#16a34a" : "#2563eb",
        color: "#fff",
        border: "none",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
      }}
    >
      {saved ? "✅ Bookmarked" : "🔖 Bookmark"}
    </button>
  );
}

export default BookmarkButton;