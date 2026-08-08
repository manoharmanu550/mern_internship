import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../styles/CreatePost.css";

function CreatePost() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState("published");

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setCoverImage(reader.result);
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!title || !content || !excerpt) {
      return alert("Please fill all required fields");
    }

    try {
      setLoading(true);

      await API.post(
        "/posts",
        {
          title,
          content,
          excerpt,
          coverImage,
          status,
          tags: [],
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("🎉 Post Published Successfully");
      navigate("/");
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-wrapper">
      <div className="create-card">

        <h1>Create New Blog</h1>
        <p>Share your ideas with the world.</p>

        <form onSubmit={submitHandler}>

          <label>Title</label>

          <input
            type="text"
            placeholder="Enter Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Content</label>

          <textarea
            rows="8"
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <label>Excerpt</label>

          <input
            type="text"
            placeholder="Short Description"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          <label>Cover Image</label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />
          )}

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
            disabled={loading}
            className="publish-btn"
          >
            {loading ? "Publishing..." : "🚀 Publish Post"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default CreatePost;