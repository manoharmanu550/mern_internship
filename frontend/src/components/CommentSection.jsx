import { useEffect, useState } from "react";
import API from "../services/api";
import CommentCard from "./CommentCard";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await API.get(`/comments/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.log(err);
    }
  };

  const addComment = async () => {
    if (!text.trim()) {
      return alert("Enter Comment");
    }

    try {
      await API.post(
        "/comments",
        {
          post: postId,
          text,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setText("");

      fetchComments();
    } catch (err) {
      alert(err.response?.data?.message || "Comment Failed");
    }
  };

  return (
    <div style={{ marginTop: "40px" }}>
      <h2>💬 Comments ({comments.length})</h2>

      <textarea
        rows="4"
        placeholder="Write your comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
        }}
      />

      <br />
      <br />

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

      <hr
        style={{
          margin: "30px 0",
        }}
      />

      {comments.length === 0 ? (
        <h3>No Comments Yet</h3>
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