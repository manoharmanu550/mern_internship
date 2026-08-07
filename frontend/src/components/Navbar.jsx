import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { FaHeart } from "react-icons/fa";
import { FaChartBar } from "react-icons/fa";

import {
  FaHome,
  FaPlusCircle,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">🚀 Blogging Platform</div>

      <div className="nav-links">
        <Link to="/">
          <FaHome /> Home
        </Link>

        <Link to="/search">
          <FaSearch /> Search
        </Link>

        <Link to="/create">
          <FaPlusCircle /> Create
        </Link>

        <Link to="/profile">
          <FaUserCircle /> Profile
        </Link>
        <Link to="/bookmarks">🔖 Bookmarks</Link>
      </div>
      <Link to="/likes"><FaHeart /> Likes
    </Link>
    <Link to="/dashboard">
  <FaChartBar /> Dashboard
</Link>
    </nav>
  );
};

export default Navbar;