const Post = require("../models/Post");

// =======================
// Create Post
// =======================
const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      coverImage,
      status,
      tags,
    } = req.body;

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const post = await Post.create({
      title,
      slug,
      content,
      excerpt,
      coverImage,
      status,
      tags,
      author: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Post Created Successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get All Posts
// =======================
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("tags", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get My Posts
// =======================
const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      author: req.user._id,
    })
      .populate("author", "name email")
      .populate("tags", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Search Posts
// =======================
const searchPosts = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const posts = await Post.find({
      $or: [
        {
          title: {
            $regex: keyword,
            $options: "i",
          },
        },
        {
          content: {
            $regex: keyword,
            $options: "i",
          },
        },
      ],
    })
      .populate("author", "name email")
      .populate("tags", "name description")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Get Single Post
// =======================
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("tags", "name description");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Update Post
// =======================
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    Object.assign(post, req.body);

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post Updated Successfully",
      post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// Delete Post
// =======================
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getMyPosts,
  searchPosts,
  getPostById,
  updatePost,
  deletePost,
};