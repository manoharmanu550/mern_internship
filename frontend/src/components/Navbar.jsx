import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

import { FaHeart } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

import {
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaUserCircle,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();

  // Check whether user is logged in
  const token = localStorage.getItem("token");

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    alert("👋 Logged out successfully");

    navigate("/login");
  };

  return (
    <nav className="navbar">

      {/* Logo */}
      <div className="logo">
        🚀 Blogging Platform
      </div>

      {/* Navigation Links */}
      <div className="nav-links">

        {/* Home */}
        <Link to="/">
          <FaHome /> Home
        </Link>

        {/* Search */}
        <Link to="/search">
          <FaSearch /> Search
        </Link>

        {/* Logged-in user links */}
        {token && (
          <>
            <Link to="/create">
              <FaPlusCircle /> Create
            </Link>

            <Link to="/profile">
              <FaUserCircle /> Profile
            </Link>

            <Link to="/bookmarks">
              🔖 Bookmarks
            </Link>

            <Link to="/likes">
              <FaHeart /> Likes
            </Link>

            <Link to="/dashboard">
              <FaChartBar /> Dashboard
            </Link>
          </>
        )}

        {/* Login / Register / Logout */}
        {!token ? (
          <>
          <Link to="/register">
              <FaUserPlus /> Register
            </Link>
            
            <Link to="/login">
              <FaSignInAlt /> Login
            </Link>

            
          </>
        ) : (
          <button
            type="button"
            onClick={handleLogout}
            className="logout-btn"
          >
            <FaSignOutAlt /> Logout
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;