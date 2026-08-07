import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import SinglePost from "./pages/SinglePost";
import EditPost from "./pages/EditPost";
import Bookmarks from "./pages/Bookmarks";
import Likes from "./pages/Likes";
import Dashboard from "./pages/Dashboard";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePost />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<Search />} />
        <Route path="/edit/:id" element={<EditPost />} />
        <Route path="/post/:id" element={<SinglePost />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/likes" element={<Likes />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
      </Routes>
    </>
  );
}

export default App;