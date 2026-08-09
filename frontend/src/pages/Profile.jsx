import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Profile.css";

function Profile() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await API.get("/posts/mine", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (Array.isArray(res.data)) {
        setPosts(res.data);
      } else if (Array.isArray(res.data.posts)) {
        setPosts(res.data.posts);
      } else {
        setPosts([]);
      }
    } catch (err) {
      console.log(err);
      alert("Failed to load your posts");
    }
  };

  const deletePost = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await API.delete(`/posts/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setPosts(posts.filter((post) => post._id !== id));

      alert("Post Deleted Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="profile-page">

      {/* Header */}
      <div className="profile-header">
        <span>👤</span>
        <h1>My Profile</h1>
      </div>

      {/* Stats */}
      <div className="stats">

        <div className="stat-card">
          <h2>{posts.length}</h2>
          <p>Total Posts</p>
        </div>

        <div className="stat-card">
          <h2>❤️</h2>
          <p>
            <Link to="/likes">Likes</Link>
          </p>
        </div>

        <div className="stat-card">
          <h2>🔖</h2>
          <p>
            <Link to="/bookmarks">Bookmarks</Link>
          </p>
        </div>

      </div>

      {/* Posts */}

      {posts.length === 0 ? (

        <h2 className="no-posts">
          No Posts Found
        </h2>

      ) : (

        <div className="posts-grid">

          {posts.map((post) => (

            <div
              className="profile-card"
              key={post._id}
            >

              <img
                src={post.coverImage}
                alt={post.title}
              />

              <div className="profile-card-content">

                <h3>{post.title}</h3>

                <p>{post.excerpt}</p>

                <p>
                  <b>Status :</b> {post.status}
                </p>

                <div className="profile-buttons">

                  <Link to={`/edit/${post._id}`}>
                    <button className="edit-btn">
                      ✏ Edit
                    </button>
                  </Link>

                  <button
                    className="delete-btn"
                    onClick={() => deletePost(post._id)}
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Profile;