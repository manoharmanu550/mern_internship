const Tag = require("../models/Tag");

// Create Tag
const createTag = async (req, res) => {
  try {
    const { name, description } = req.body;

    const tag = await Tag.create({
      name,
      description,
    });

    res.status(201).json({
      message: "Tag Created Successfully",
      tag,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get All Tags
const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();

    res.status(200).json({
      message: "Tags Fetched Successfully",
      tags,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Single Tag
const getTagById = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag Not Found",
      });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Tag
const updateTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tag) {
      return res.status(404).json({
        message: "Tag Not Found",
      });
    }

    res.status(200).json({
      message: "Tag Updated Successfully",
      tag,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Tag
const deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findByIdAndDelete(req.params.id);

    if (!tag) {
      return res.status(404).json({
        message: "Tag Not Found",
      });
    }

    res.status(200).json({
      message: "Tag Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createTag,
  getTags,
  getTagById,
  updateTag,
  deleteTag,
};