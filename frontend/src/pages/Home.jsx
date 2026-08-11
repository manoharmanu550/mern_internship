import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

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

        setError(
          "Failed to load posts. Please try again."
        );

        setLoading(false);
      });
  }, []);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="home">
        <div className="loading">
          Loading posts...
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="home">

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <section className="hero">

        <div className="hero-content">

          <h1>
            Welcome to Blogging Platform 🚀
          </h1>

          <p>
            Share your ideas, discover amazing stories,
            and connect with people through the power
            of blogging.
          </p>

          <Link to="/create">
            <button>
              ✍️ Create Your Post
            </button>
          </Link>

        </div>

      </section>


      {/* =================================================
          BLOG SECTION
      ================================================= */}

      <section className="blog-section">

        <h2>
          Latest Posts ✨
        </h2>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="no-posts">
            {error}
          </div>
        )}


        {/* =================================================
            NO POSTS
        ================================================= */}

        {!error && posts.length === 0 && (
          <div className="no-posts">
            📝 No posts available yet.
          </div>
        )}


        {/* =================================================
            POSTS
        ================================================= */}

        {!error && posts.length > 0 && (

          <div className="posts-grid">

            {posts.map((post) => (

              <article
                key={post._id || post.id}
                className="post-card"
              >

                {/* =========================================
                    COVER IMAGE
                ========================================= */}

                {(post.coverImage ||
                  post.image ||
                  post.imageUrl) && (

                  <img
                    src={
                      post.coverImage ||
                      post.image ||
                      post.imageUrl
                    }
                    alt={
                      post.title ||
                      "Blog post"
                    }
                  />

                )}


                {/* =========================================
                    POST CONTENT
                ========================================= */}

                <div className="post-content">

                  <h3>
                    {post.title ||
                      "Untitled Post"}
                  </h3>


                  <p>
                    {post.excerpt ||
                      post.description ||
                      post.content ||
                      "No content available"}
                  </p>


                  {/* =======================================
                      AUTHOR
                  ======================================= */}

                  {post.author && (

                    <small>
                      ✍️ Author:{" "}

                      {typeof post.author === "object"
                        ? post.author.name ||
                          post.author.username ||
                          "Unknown"
                        : post.author}
                    </small>

                  )}


                  {/* =======================================
                      DATE
                  ======================================= */}

                  {post.createdAt && (

                    <small
                      style={{
                        display: "block",
                        marginTop: "6px",
                      }}
                    >
                      📅{" "}
                      {new Date(
                        post.createdAt
                      ).toLocaleDateString()}
                    </small>

                  )}


                  {/* =======================================
                      READ POST
                  ======================================= */}

                  <Link
                    to={`/post/${post._id || post.id}`}
                    className="read-btn"
                  >
                    Read Article →
                  </Link>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </div>
  );
};

export default Home;