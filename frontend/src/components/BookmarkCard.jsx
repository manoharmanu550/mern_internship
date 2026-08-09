import { Link } from "react-router-dom";
import API from "../services/api";

function BookmarkCard({ bookmark, refresh }) {
  // Get actual post object
  const post = bookmark.post || bookmark;

  // Debug logs
  console.log("Bookmark Object:", bookmark);
  console.log("Post Object:", post);
  console.log("Post ID:", post._id);

  const removeBookmark = async () => {
    const ok = window.confirm("Remove this bookmark?");

    if (!ok) return;

    try {
      await API.delete(`/bookmarks/${post._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("🔖 Bookmark Removed");

      if (refresh) {
        refresh();
      }
    } catch (err) {
      console.log("DELETE Error:", err);
      console.log("Response:", err.response);
      alert(err.response?.data?.message || "Failed to remove bookmark");
    }
  };

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
      <img
        src={
          post.coverImage && post.coverImage.trim() !== ""
            ? post.coverImage
            : "https://via.placeholder.com/600x350?text=No+Image"
        }
        alt={post.title}
        style={{
          width: "100%",
          height: "220px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "15px" }}>
        <h2>{post.title}</h2>

        <p>{post.excerpt}</p>

        <p>
          <strong>Author:</strong> {post.author?.name || "Unknown"}
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "15px",
          }}
        >
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