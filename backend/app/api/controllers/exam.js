const examModel = require("../models/exam");

module.exports = {
  create: async function (req, res, next) {
    const exam = req.body;
    await examModel.create(exam, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Exam added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let exams = await examModel.find();
    res.status(200).json({ message: null, data: exams });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let exams = await examModel.find(filter);
    res.status(200).json({ message: null, data: exams });
  },
  getById: function (req, res, next) {
    examModel.findById(req.params.id, function (err, exam) {
      if (err) {
        res.status(404).json({ message: "Exam not found", data: null });
      } else {
        res.status(200).json({ message: null, data: exam });
      }
    });
  },
  updateById: function (req, res, next) {
    const exam = req.body;
    examModel.findByIdAndUpdate(req.params.id, exam, function (
      err,
      examInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Exam updated successfully!", data: examInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    examModel.findByIdAndRemove(req.params.id, function (err, examInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Exam deleted successfully!", data: null });
      }
    });
  },
};
