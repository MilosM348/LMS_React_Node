const commentModel = require("../models/comment");

module.exports = {
  create: async function (req, res, next) {
    const comment = req.body;
    await commentModel.create(comment, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Comment added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let comments = await commentModel.find();
    res.status(200).json({ message: null, data: comments });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let comments = await commentModel.find(filter);
    res.status(200).json({ message: null, data: comments });
  },
  getById: function (req, res, next) {
    commentModel.findById(req.params.id, function (err, comment) {
      if (err) {
        res.status(404).json({ message: "Comment not found", data: null });
      } else {
        res.status(200).json({ message: null, data: comment });
      }
    });
  },
  updateById: function (req, res, next) {
    const comment = req.body;
    commentModel.findByIdAndUpdate(req.params.id, comment, function (
      err,
      commentInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Comment updated successfully!", data: commentInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    commentModel.findByIdAndRemove(req.params.id, function (err, commentInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Comment deleted successfully!", data: null });
      }
    });
  },
};
