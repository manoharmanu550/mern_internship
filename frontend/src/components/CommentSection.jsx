import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/CommentSection.css";

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");

  // =========================================================
  // GET COMMENTS
  // =========================================================

  const fetchComments = async () => {
    if (!postId) {
      console.error(
        "CommentSection: postId is missing"
      );

      setError("Post ID is missing");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log(
        "================================="
      );
      console.log("GET COMMENTS");
      console.log("Post ID:", postId);
      console.log(
        "================================="
      );

      const response = await API.get(
        `/comments/${String(postId)}`
      );

      console.log(
        "Comments API Response:",
        response.data
      );

      const data = response.data;

      // -----------------------------------------------------
      // Handle different response formats
      // -----------------------------------------------------

      if (Array.isArray(data)) {
        setComments(data);
      } else if (Array.isArray(data.comments)) {
        setComments(data.comments);
      } else if (Array.isArray(data.data)) {
        setComments(data.data);
      } else {
        setComments([]);
      }

    } catch (err) {

      console.error(
        "================================="
      );

      console.error(
        "GET COMMENTS ERROR"
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      console.error(
        "Error:",
        err
      );

      console.error(
        "================================="
      );

      setError(
        err.response?.data?.message ||
        "Failed to load comments"
      );

      setComments([]);

    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // LOAD COMMENTS
  // =========================================================

  useEffect(() => {
    fetchComments();
  }, [postId]);


  // =========================================================
  // ADD COMMENT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------------------------------
    // Clean comment text
    // -----------------------------------------------------

    const cleanText = text.trim();


    // -----------------------------------------------------
    // Validate comment text
    // -----------------------------------------------------

    if (!cleanText) {
      alert("Comment text is required");
      return;
    }


    // -----------------------------------------------------
    // Validate Post ID
    // -----------------------------------------------------

    if (!postId) {
      alert("Post ID is missing");
      return;
    }


    // -----------------------------------------------------
    // Get Token
    // -----------------------------------------------------

    const token =
      localStorage.getItem("token");


    if (!token) {
      alert("Please login first");
      return;
    }


    try {

      setSubmitting(true);
      setError("");


      console.log(
        "================================="
      );

      console.log(
        "ADDING COMMENT"
      );

      console.log(
        "Post ID:",
        String(postId)
      );

      console.log(
        "Comment Text:",
        cleanText
      );

      console.log(
        "Token Exists:",
        !!token
      );

      console.log(
        "================================="
      );


      // =====================================================
      // ADD COMMENT API
      // =====================================================

      const response = await API.post(
        "/comments",
        {
          postId: String(postId),
          text: cleanText,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );


      // -----------------------------------------------------
      // API RESPONSE
      // -----------------------------------------------------

      console.log(
        "================================="
      );

      console.log(
        "ADD COMMENT RESPONSE"
      );

      console.log(
        "Status:",
        response.status
      );

      console.log(
        "Response:",
        response.data
      );

      console.log(
        "================================="
      );


      const data = response.data;


      // =====================================================
      // ADD NEW COMMENT TO UI
      // =====================================================

      if (data.comment) {

        setComments((prev) => [
          data.comment,
          ...prev,
        ]);

      } else if (data.data) {

        setComments((prev) => [
          data.data,
          ...prev,
        ]);

      } else {

        // If backend does not return comment
        // fetch comments again

        await fetchComments();
      }


      // Clear textarea

      setText("");


      alert(
        "Comment added successfully"
      );


    } catch (err) {

      console.error(
        "================================="
      );

      console.error(
        "ADD COMMENT ERROR"
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      console.error(
        "Error:",
        err
      );

      console.error(
        "================================="
      );


      const message =
        err.response?.data?.message ||
        "Failed to add comment";


      setError(message);


      alert(message);


    } finally {

      setSubmitting(false);

    }
  };


  // =========================================================
  // DELETE COMMENT
  // =========================================================

  const handleDelete = async (commentId) => {

    if (!commentId) {
      alert("Comment ID is missing");
      return;
    }


    const token =
      localStorage.getItem("token");


    if (!token) {
      alert("Please login first");
      return;
    }


    // -----------------------------------------------------
    // Confirmation
    // -----------------------------------------------------

    const confirmed =
      window.confirm(
        "Delete this comment?"
      );


    if (!confirmed) {
      return;
    }


    try {

      setDeletingId(commentId);


      console.log(
        "================================="
      );

      console.log(
        "DELETE COMMENT"
      );

      console.log(
        "Comment ID:",
        commentId
      );

      console.log(
        "================================="
      );


      const response =
        await API.delete(
          `/comments/${String(commentId)}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "Delete Comment Response:",
        response.data
      );


      // -----------------------------------------------------
      // Remove from UI
      // -----------------------------------------------------

      setComments((prev) =>
        prev.filter(
          (comment) =>
            String(
              comment._id ||
              comment.id
            ) !== String(commentId)
        )
      );


      alert(
        "Comment deleted successfully"
      );


    } catch (err) {

      console.error(
        "================================="
      );

      console.error(
        "DELETE COMMENT ERROR"
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      console.error(
        "Error:",
        err
      );

      console.error(
        "================================="
      );


      alert(
        err.response?.data?.message ||
        "Failed to delete comment"
      );


    } finally {

      setDeletingId(null);

    }
  };


  // =========================================================
  // GET AUTHOR NAME
  // =========================================================

  const getAuthorName = (comment) => {

    if (!comment) {
      return "Unknown";
    }


    // -----------------------------------------------------
    // Populated author object
    // -----------------------------------------------------

    if (
      comment.author &&
      typeof comment.author === "object"
    ) {

      return (
        comment.author.name ||
        comment.author.username ||
        comment.author.email ||
        "Unknown"
      );
    }


    // -----------------------------------------------------
    // User object
    // -----------------------------------------------------

    if (comment.user) {

      if (
        typeof comment.user === "object"
      ) {

        return (
          comment.user.name ||
          comment.user.username ||
          comment.user.email ||
          "Unknown"
        );
      }


      return comment.user;
    }


    // -----------------------------------------------------
    // Author string
    // -----------------------------------------------------

    return (
      comment.author ||
      "Unknown"
    );
  };


  // =========================================================
  // GET COMMENT TEXT
  // =========================================================

  const getCommentText = (comment) => {

    if (!comment) {
      return "";
    }


    return (
      comment.text ||
      comment.content ||
      comment.comment ||
      ""
    );
  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "";
    }


    try {

      return new Date(
        date
      ).toLocaleString();

    } catch {

      return "";

    }
  };


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <section className="comment-section">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="comment-header">

        <h3>
          💬 Comments

          {comments.length > 0 &&
            ` (${comments.length})`}
        </h3>

      </div>


      {/* =====================================================
          ADD COMMENT FORM
      ===================================================== */}

      <form
        className="comment-form"
        onSubmit={handleSubmit}
      >

        <textarea
          value={text}
          onChange={(e) =>
            setText(e.target.value)
          }
          placeholder="Write your comment..."
          maxLength={1000}
          disabled={submitting}
        />


        <div className="comment-form-bottom">

          <span className="comment-counter">
            {text.length}/1000
          </span>


          <button
            type="submit"
            disabled={
              submitting ||
              !text.trim()
            }
          >

            {submitting
              ? "Adding..."
              : "💬 Add Comment"}

          </button>

        </div>

      </form>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="comment-error">
          {error}
        </div>
      )}


      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="comment-loading">
          Loading comments...
        </div>
      )}


      {/* =====================================================
          NO COMMENTS
      ===================================================== */}

      {!loading &&
        comments.length === 0 &&
        !error && (

          <div className="no-comments">
            No comments yet.
            Be the first to comment! 💬
          </div>

        )}


      {/* =====================================================
          COMMENTS LIST
      ===================================================== */}

      {!loading &&
        comments.length > 0 && (

          <div className="comments-list">

            {comments.map(
              (comment) => {

                const commentId =
                  comment._id ||
                  comment.id;


                return (

                  <div
                    className="comment-card"
                    key={commentId}
                  >

                    {/* ================================
                        COMMENT TOP
                    ================================= */}

                    <div className="comment-top">

                      <div>

                        <strong>
                          {getAuthorName(
                            comment
                          )}
                        </strong>

                      </div>


                      <small>
                        {formatDate(
                          comment.createdAt
                        )}
                      </small>

                    </div>


                    {/* ================================
                        COMMENT TEXT
                    ================================= */}

                    <p className="comment-content">

                      {getCommentText(
                        comment
                      )}

                    </p>


                    {/* ================================
                        DELETE BUTTON
                    ================================= */}

                    <button
                      type="button"
                      className="delete-comment-btn"
                      onClick={() =>
                        handleDelete(
                          commentId
                        )
                      }
                      disabled={
                        deletingId ===
                        commentId
                      }
                    >

                      {deletingId ===
                      commentId
                        ? "Deleting..."
                        : "🗑️ Delete"}

                    </button>

                  </div>

                );
              }
            )}

          </div>

        )}

    </section>
  );
}


export default CommentSection;