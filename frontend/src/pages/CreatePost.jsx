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

  // =========================
  // Handle Cover Image
  // =========================
  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setCoverImage(reader.result);
      setPreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  // =========================
  // Submit Post
  // =========================
  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate fields
    if (
      !title.trim() ||
      !content.trim() ||
      !excerpt.trim()
    ) {
      alert("Please fill all required fields");
      return;
    }

    // Check login token
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      console.log("Creating post...");

      // Send post to backend
      const response = await API.post(
        "/posts",
        {
          title: title.trim(),
          content: content.trim(),
          excerpt: excerpt.trim(),
          coverImage,
          status,
          tags: [],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Create Post Response:",
        response.data
      );

      // Success
      alert("🎉 Post Published Successfully!");

      // Go to Home page
      navigate("/");
    } catch (err) {
      console.error(
        "Create Post Error:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Response:",
        err.response?.data
      );

      alert(
        err.response?.data?.message ||
          "Failed to create post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-wrapper">

      <div className="create-card">

        {/* =========================
            Header
        ========================== */}

        <h1>Create New Blog</h1>

        <p>
          Share your ideas with the world.
        </p>

        {/* =========================
            Form
        ========================== */}

        <form onSubmit={submitHandler}>

          {/* Title */}

          <label htmlFor="title">
            Title
          </label>

          <input
            id="title"
            type="text"
            placeholder="Enter Blog Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
          />

          {/* Content */}

          <label htmlFor="content">
            Content
          </label>

          <textarea
            id="content"
            rows="8"
            placeholder="Write your blog content..."
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
          />

          {/* Excerpt */}

          <label htmlFor="excerpt">
            Excerpt
          </label>

          <input
            id="excerpt"
            type="text"
            placeholder="Short Description"
            value={excerpt}
            onChange={(e) =>
              setExcerpt(e.target.value)
            }
          />

          {/* Cover Image */}

          <label htmlFor="coverImage">
            Cover Image
          </label>

          <input
            id="coverImage"
            type="file"
            accept="image/*"
            onChange={handleImage}
          />

          {/* Image Preview */}

          {preview && (
            <div className="preview-container">
              <img
                src={preview}
                alt="Cover Preview"
                className="preview-image"
              />
            </div>
          )}

          {/* Status */}

          <label htmlFor="status">
            Status
          </label>

          <select
            id="status"
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>
          </select>

          {/* Publish Button */}

          <button
            type="submit"
            disabled={loading}
            className="publish-btn"
          >
            {loading
              ? "Publishing..."
              : "🚀 Publish Post"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreatePost;