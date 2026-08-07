import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PostCard from "../components/PostCard";
import "../styles/Home.css";

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await API.get("/posts");
      setPosts(res.data.posts || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Blogging Platform</h1>

          <p>
            Discover amazing articles, share your ideas and connect with
            developers around the world.
          </p>

          <button onClick={() => navigate("/search")}>
            Start Reading
          </button>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="blog-section">
        <h2>Latest Blogs</h2>

        {loading ? (
          <div className="loading">
            <h2>Loading Posts...</h2>
          </div>
        ) : posts.length === 0 ? (
          <div className="no-posts">
            <h2>No Posts Available</h2>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;