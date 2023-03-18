const NewCommentModel = require("../models/newComment");

module.exports = {
  create: async function (req, res, next) {
    const newComment = req.body;
    await NewCommentModel.create(newComment, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "NewComment added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let newComments = await NewCommentModel.find();
    res.status(200).json({ message: null, data: newComments });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let newComments = await NewCommentModel.find(filter);
    res.status(200).json({ message: null, data: newComments });
  },
  getById: function (req, res, next) {
    NewCommentModel.findById(req.params.id, function (err, newComment) {
      if (err) {
        res.status(404).json({ message: "NewComment not found", data: null });
      } else {
        res.status(200).json({ message: null, data: newComment });
      }
    });
  },
  updateById: function (req, res, next) {
    const newComment = req.body;
    NewCommentModel.findByIdAndUpdate(req.params.id, newComment, function (
      err,
      newCommentInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "NewComment updated successfully!", data: newCommentInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    NewCommentModel.findByIdAndRemove(req.params.id, function (err, newCommentInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "NewComment deleted successfully!", data: null });
      }
    });
  },
};
