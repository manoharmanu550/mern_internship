const Like = require("../models/Like");

// Like Post
const likePost = async (req, res) => {
  try {
    const { post } = req.body;

    const alreadyLiked = await Like.findOne({
      post,
      user: req.user._id,
    });

    if (alreadyLiked) {
      return res.status(400).json({
        message: "You already liked this post",
      });
    }

    const like = await Like.create({
      post,
      user: req.user._id,
    });

    res.status(201).json({
      message: "Post Liked Successfully",
      like,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Likes Count
const getLikes = async (req, res) => {
  try {
    const likes = await Like.countDocuments({
      post: req.params.postId,
    });

    res.status(200).json({
      likes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get My Liked Posts
const getMyLikes = async (req, res) => {
  try {
    const likes = await Like.find({
      user: req.user._id,
    }).populate({
      path: "post",
      populate: {
        path: "author",
        select: "name email",
      },
    });

    res.status(200).json({
      likes,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Unlike Post
const unlikePost = async (req, res) => {
  try {
    const like = await Like.findOneAndDelete({
      user: req.user._id,
      post: req.params.postId,
    });

    if (!like) {
      return res.status(404).json({
        message: "Like Not Found",
      });
    }

    res.status(200).json({
      message: "Post Unliked Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  likePost,
  getLikes,
  getMyLikes,
  unlikePost,
};