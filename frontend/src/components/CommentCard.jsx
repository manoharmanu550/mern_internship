import API from "../services/api";

function CommentCard({ comment, refresh }) {
  const deleteComment = async () => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await API.delete(`/comments/${comment._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      refresh();
    } catch (err) {
      console.error("Delete comment error:", err);

      alert(
        err.response?.data?.message ||
        "Delete Failed"
      );
    }
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "15px",
        marginBottom: "15px",
        borderRadius: "10px",
      }}
    >
      <h4>
        {comment.author?.name || "Unknown User"}
      </h4>

      <p>
        {comment.text}
      </p>

      <small>
        {comment.createdAt
          ? new Date(comment.createdAt).toLocaleString()
          : ""}
      </small>

      <br />
      <br />

      <button
        onClick={deleteComment}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "8px 14px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        🗑 Delete
      </button>
    </div>
  );
}

export default CommentCard;