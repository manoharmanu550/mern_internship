const Comment = require("../models/Comment");

// Create Comment
const createComment = async (req, res) => {
  try {
    const { content, post } = req.body;

    const comment = await Comment.create({
      content,
      post,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Comment Created Successfully",
      comment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get Comments by Post
const getCommentsByPost = async (req, res) => {
  try {
    const comments = await Comment.find({
      post: req.params.postId,
    }).populate("author", "name email");

    res.status(200).json({
      message: "Comments Fetched Successfully",
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createComment,
  getCommentsByPost,
};