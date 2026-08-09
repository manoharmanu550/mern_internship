import { Link } from "react-router-dom";
import "../styles/PostCard.css";
import BookmarkButton from "./BookmarkButton";

function PostCard({ post }) {
  return (
    <div className="post-card">
      <img
        src={
          post.coverImage && post.coverImage !== ""
            ? post.coverImage
            : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"
        }
        alt={post.title}
        className="post-image"
      />

      <div className="post-content">
        <h2>{post.title}</h2>

        <p>
          {post.excerpt
            ? post.excerpt
            : post.content.substring(0, 120) + "..."}
        </p>

        <div className="post-footer">
          <span>✍ {post.author?.name || "Unknown"}</span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "15px",
          }}
        >
          <Link to={`/post/${post._id}`} className="read-btn">
            Read More →
          </Link>

          <BookmarkButton post={post} />
        </div>
      </div>
    </div>
  );
}

export default PostCard;