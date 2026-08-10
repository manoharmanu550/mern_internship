import { Link } from "react-router-dom";
import API from "../services/api";

function BookmarkCard({ bookmark, refresh }) {
  // ========================================
  // Get Post Object
  // ========================================
  const post = bookmark?.post;

  // ========================================
  // Debug
  // ========================================
  console.log("========== BOOKMARK DEBUG ==========");
  console.log("Bookmark:", bookmark);
  console.log("Bookmark ID:", bookmark?._id);
  console.log("Post:", post);
  console.log("Post ID:", post?._id);

  // ========================================
  // REMOVE BOOKMARK
  // ========================================
  const removeBookmark = async () => {
    const ok = window.confirm("Remove this bookmark?");

    if (!ok) return;

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

      // IMPORTANT:
      // Delete using BOOKMARK ID
      const bookmarkId = bookmark?._id;

      console.log("========== REMOVE BOOKMARK ==========");
      console.log("Bookmark ID:", bookmarkId);
      console.log("Bookmark:", bookmark);

      if (!bookmarkId) {
        alert("Bookmark ID not found");
        return;
      }

      const response = await API.delete(
        `/bookmarks/id/${bookmarkId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("DELETE SUCCESS:", response.data);

      alert("🔖 Bookmark Removed Successfully");

      // Refresh bookmarks list
      if (refresh) {
        await refresh();
      }
    } catch (err) {
      console.error("DELETE BOOKMARK ERROR:", err);
      console.error("Response:", err.response?.data);
      console.error("Status:", err.response?.status);

      alert(
        err.response?.data?.message ||
          "Failed to remove bookmark"
      );
    }
  };

  // ========================================
  // IF POST IS NOT AVAILABLE
  // ========================================
  if (!post) {
    return (
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: "10px",
          padding: "20px",
          background: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3>Post Not Available</h3>

        <p>
          This bookmarked post is no longer available.
        </p>

        <button
          onClick={removeBookmark}
          style={{
            padding: "8px 15px",
            background: "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Remove
        </button>
      </div>
    );
  }

  // ========================================
  // NORMAL BOOKMARK CARD
  // ========================================
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      {/* Cover Image */}
      <img
        src={
          post.coverImage &&
          post.coverImage.trim() !== ""
            ? post.coverImage
            : "https://placehold.co/600x350?text=No+Image"
        }
        alt={post.title || "Post"}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
        }}
        onError={(e) => {
          e.target.src =
            "https://placehold.co/600x350?text=No+Image";
        }}
      />

      {/* Content */}
      <div style={{ padding: "15px" }}>
        <h2>
          {post.title || "Untitled Post"}
        </h2>

        <p>
          {post.excerpt || "No description available."}
        </p>

        <p>
          <strong>Author:</strong>{" "}
          {post.author?.name || "Unknown"}
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
          {/* Read More */}
          <Link to={`/post/${post._id}`}>
            <button
              style={{
                padding: "8px 15px",
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Read More
            </button>
          </Link>

          {/* Remove Bookmark */}
          <button
            onClick={removeBookmark}
            style={{
              padding: "8px 15px",
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookmarkCard;