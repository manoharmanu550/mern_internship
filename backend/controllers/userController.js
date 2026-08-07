const User = require("../models/User");

// Get My Profile
const getMyProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update My Profile
const updateMyProfile = async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;
    user.avatarUrl = avatarUrl || user.avatarUrl;

    await user.save();

    res.status(200).json({
      message: "Profile Updated Successfully",
      user,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
};