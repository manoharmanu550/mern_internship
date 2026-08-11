import { useEffect, useState } from "react";
import API from "../services/api";
import CommentCard from "./CommentCard";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${postId}`);

      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Fetch comments error:", err);
    }
  };

  // ======================================================
  // ADD COMMENT
  // ======================================================

  const addComment = async () => {
    // Check empty comment
    if (!text.trim()) {
      alert("Enter Comment");
      return;
    }

    // Check post ID
    if (!postId) {
      alert("Post ID is missing");
      return;
    }

    try {
      const response = await API.post(
        "/comments",
        {
          postId: postId,
          text: text.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(
        "Comment added successfully:",
        response.data
      );

      // Clear textarea
      setText("");

      // Refresh comments
      await fetchComments();

    } catch (err) {
      console.error(
        "Add comment error:",
        err.response?.data || err
      );

      alert(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Comment Failed"
      );
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>

      <h2>
        💬 Comments ({comments.length})
      </h2>

      {/* ==================================================
          COMMENT TEXTAREA
      ================================================== */}

      <textarea
        rows="4"
        placeholder="Write your comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />

      <br />
      <br />

      {/* ==================================================
          ADD COMMENT BUTTON
      ================================================== */}

      <button
        onClick={addComment}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "10px 18px",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Add Comment
      </button>

      {/* ==================================================
          SEPARATOR
      ================================================== */}

      <hr
        style={{
          margin: "30px 0",
        }}
      />

      {/* ==================================================
          COMMENTS LIST
      ================================================== */}

      {comments.length === 0 ? (

        <h3>
          No Comments Yet
        </h3>

      ) : (

        comments.map((comment) => (

          <CommentCard
            key={comment._id}
            comment={comment}
            refresh={fetchComments}
          />

        ))

      )}

    </div>
  );
}

export default CommentSection;