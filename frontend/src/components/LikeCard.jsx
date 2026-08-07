import { Link } from "react-router-dom";
import API from "../services/api";

function LikeCard({ like, refresh }) {
  const post = like.post || like;

  const unlikePost = async () => {
    const ok = window.confirm("Remove Like?");

    if (!ok) return;

    try {
      await API.delete(`/likes/${post._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("❤️ Like Removed");

      if (refresh) {
        refresh();
      }
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
          "Failed to Remove Like"
      );
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
        src={post.coverImage}
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
          <strong>Author:</strong>{" "}
          {post.author?.name || "Unknown"}
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
                background: "#1976d2",
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Read More
            </button>
          </Link>

          <button
            onClick={unlikePost}
            style={{
              background: "red",
              color: "#fff",
              border: "none",
              padding: "8px 15px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ❤️ Unlike
          </button>
        </div>
      </div>
    </div>
  );
}

export default LikeCard;