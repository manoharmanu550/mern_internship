import React, { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(
        "https://mern-internship-backend-p9ri.onrender.com/api/posts"
      )
      .then((res) => {
        console.log("Posts response:", res.data);

        // Handle different response formats
        if (Array.isArray(res.data)) {
          setPosts(res.data);
        } else if (Array.isArray(res.data.posts)) {
          setPosts(res.data.posts);
        } else if (Array.isArray(res.data.data)) {
          setPosts(res.data.data);
        } else {
          setPosts([]);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);

        setError("Failed to load posts. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="home-container">
      <h1>Home</h1>

      {loading && <p>Loading posts...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p>No posts available.</p>
      )}

      {!loading &&
        !error &&
        posts.map((post) => (
          <div key={post._id || post.id} className="post-card">
            <h2>{post.title || "Untitled Post"}</h2>

            <p>
              {post.content ||
                post.description ||
                "No content available"}
            </p>

            {post.author && (
              <small>
                Author:{" "}
                {typeof post.author === "object"
                  ? post.author.name || post.author.username
                  : post.author}
              </small>
            )}
          </div>
        ))}
    </div>
  );
};

export default Home;