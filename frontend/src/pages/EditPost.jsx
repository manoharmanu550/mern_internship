import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../services/api";
import "../styles/EditPost.css";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("published");

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const res = await API.get(`/posts/${id}`);

      setTitle(res.data.post.title || "");
      setContent(res.data.post.content || "");
      setExcerpt(res.data.post.excerpt || "");
      setCoverImage(res.data.post.coverImage || "");
      setStatus(res.data.post.status || "published");
    } catch (err) {
      console.log(err);
    }
  };

  const updatePost = async (e) => {
    e.preventDefault();

    try {
      await API.put(
        `/posts/${id}`,
        {
          title,
          content,
          excerpt,
          coverImage,
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("✅ Post Updated Successfully");
      navigate("/profile");
    } catch (err) {
      alert(err.response?.data?.message || "Update Failed");
    }
  };

  return (
    <div className="edit-page">

      <div className="edit-header">
        <span>✏️</span>
        <h1>Edit Post</h1>
      </div>

      <form className="edit-form" onSubmit={updatePost}>

        <label>Post Title</label>

        <input
          type="text"
          placeholder="Enter post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Content</label>

        <textarea
          rows="8"
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <label>Short Description</label>

        <input
          type="text"
          placeholder="Enter short description"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />

        <label>Cover Image URL</label>

        <input
          type="text"
          placeholder="Paste image URL"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
        />

        <label>Status</label>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>

        <button
          type="submit"
          className="update-btn"
        >
          🚀 Update Post
        </button>

      </form>

    </div>
  );
}

export default EditPost;