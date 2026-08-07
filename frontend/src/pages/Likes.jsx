import { useEffect, useState } from "react";
import API from "../services/api";
import LikeCard from "../components/LikeCard";
import "../styles/Likes.css";

function Likes() {
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikes();
  }, []);

  const fetchLikes = async () => {
    try {
      const res = await API.get("/likes/mine/all", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});
      setLikes(res.data.likes || []);
    } catch (error) {
      console.error("Error fetching likes:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeLike = (postId) => {
    setLikes((prevLikes) =>
      prevLikes.filter((item) => item.post?._id !== postId)
    );
  };

  if (loading) {
    return (
      <div className="likes-page">
        <h2 style={{ textAlign: "center" }}>Loading...</h2>
      </div>
    );
  }

  return (
    <div className="likes-page">

      {/* Header */}
      <div className="likes-header">
        <span>❤️</span>
        <h1>My Liked Posts</h1>
      </div>

      <p className="total-likes">
        Total Likes : {likes.length}
      </p>

      {/* Empty State */}
      {likes.length === 0 ? (
        <div className="empty-state">
          <h2>No Liked Posts Yet ❤️</h2>
          <p>Like some blogs to see them here.</p>
        </div>
      ) : (
        <div className="likes-grid">
          {likes.map((like) => (
            <LikeCard
              key={like._id}
              like={like}
              onUnlike={removeLike}
            />
          ))}
        </div>
      )}

    </div>
  );
}

export default Likes;