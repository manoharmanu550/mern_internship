import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import CommentSection from "../components/CommentSection";

function SinglePost() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    fetchPost();
    fetchLikes();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchLikes = async () => {
    try {
      const res = await API.get(`/likes/${id}`);
      setLikes(res.data.likes);
    } catch (err) {
      console.log(err);
    }
  };

  const likePost = async () => {
    try {
      await API.post(
        "/likes",
        { post: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchLikes();
      alert("❤️ Post Liked");
    } catch (err) {
      alert(err.response?.data?.message || "Like Failed");
    }
  };

  const bookmarkPost = async () => {
    try {
      await API.post(
        "/bookmarks",
        { post: id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("🔖 Post Bookmarked");
    } catch (err) {
      alert(err.response?.data?.message || "Bookmark Failed");
    }
  };

  if (!post) {
    return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        background: "#fff",
        borderRadius: "15px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      <img
        src={post.coverImage}
        alt={post.title}
        style={{
          width: "100%",
          height: "400px",
          objectFit: "cover",
        }}
      />

      <div style={{ padding: "30px" }}>
        <h1>{post.title}</h1>

        <p>
          <strong>Author:</strong> {post.author?.name}
        </p>

        <hr />

        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.8",
            marginTop: "20px",
          }}
        >
          {post.content}
        </p>

        <div
          style={{
            marginTop: "25px",
            display: "flex",
            gap: "10px",
          }}
        >
          <button onClick={likePost}>
            ❤️ Like ({likes})
          </button>

          <button onClick={bookmarkPost}>
            🔖 Bookmark
          </button>
        </div>

        {/* Comments Section */}
        <CommentSection postId={id} />
      </div>
    </div>
  );
}

export default SinglePost;