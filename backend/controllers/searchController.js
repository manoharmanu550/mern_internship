const Post = require("../models/Post");

// Search Posts
const searchPosts = async (req, res) => {
  try {
    const keyword = req.query.keyword;

    if (!keyword) {
      return res.status(400).json({
        message: "Keyword is required",
      });
    }

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
      .populate("tags", "name");

    res.status(200).json({
      total: posts.length,
      posts,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  searchPosts,
};