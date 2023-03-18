const questionModel = require("../models/question");

module.exports = {
  create: async function (req, res, next) {
    const question = req.body;
    await questionModel.create(question, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Question added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let questions = await questionModel.find();
    res.status(200).json({ message: null, data: questions });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let questions = await questionModel.find(filter);
    res.status(200).json({ message: null, data: questions });
  },
  getById: function (req, res, next) {
    questionModel.findById(req.params.id, function (err, question) {
      if (err) {
        res.status(404).json({ message: "Question not found", data: null });
      } else {
        res.status(200).json({ message: null, data: question });
      }
    });
  },
  updateById: function (req, res, next) {
    const question = req.body;
    questionModel.findByIdAndUpdate(req.params.id, question, function (
      err,
      questionInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Question updated successfully!", data: questionInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    questionModel.findByIdAndRemove(req.params.id, function (err, questionInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Question deleted successfully!", data: null });
      }
    });
  },
};
