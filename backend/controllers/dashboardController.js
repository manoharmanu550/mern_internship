const Post = require("../models/Post");
const Like = require("../models/Like");
const Bookmark = require("../models/Bookmark");
const Comment = require("../models/Comment");

const getDashboard = async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments({
      author: req.user._id,
    });

    const myPosts = await Post.find({
      author: req.user._id,
    }).select("_id");

    const postIds = myPosts.map((post) => post._id);

    const totalLikes = await Like.countDocuments({
      post: { $in: postIds },
    });

    const totalBookmarks = await Bookmark.countDocuments({
      user: req.user._id,
    });

    const totalComments = await Comment.countDocuments({
      post: { $in: postIds },
    });

    const recentPosts = await Post.find({
      author: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalPosts,
      totalLikes,
      totalBookmarks,
      totalComments,
      recentPosts,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboard,
};