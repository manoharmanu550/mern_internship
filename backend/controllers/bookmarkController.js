const Bookmark = require("../models/Bookmark");

// Save Bookmark
const saveBookmark = async (req, res) => {
  try {
    const { post } = req.body;

    const alreadySaved = await Bookmark.findOne({
      post,
      user: req.user._id,
    });

    if (alreadySaved) {
      return res.status(400).json({
        success: false,
        message: "Post already bookmarked",
      });
    }

    const bookmark = await Bookmark.create({
      post,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Bookmark Saved Successfully",
      bookmark,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Remove Bookmark
const removeBookmark = async (req, res) => {
  try {
    console.log("PostId:", req.params.postId);
    console.log("UserId:", req.user._id);

    const bookmark = await Bookmark.findOne({
      post: req.params.postId,
      user: req.user._id,
    });

    if (!bookmark) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }

    await bookmark.deleteOne();

    res.status(200).json({
      success: true,
      message: "Bookmark Removed Successfully",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get My Bookmarks
const getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({
      user: req.user._id,
    }).populate({
      path: "post",
      populate: {
        path: "author",
        select: "name email",
      },
    });

    res.status(200).json({
      success: true,
      bookmarks,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  saveBookmark,
  removeBookmark,
  getBookmarks,
};