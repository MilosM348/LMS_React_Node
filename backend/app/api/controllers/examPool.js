const examPoolModel = require("../models/examPool");

module.exports = {
  create: async function (req, res, next) {
    const examPool = req.body;
    await examPoolModel.create(examPool, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "ExamPool added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let examPools = await examPoolModel.find();
    res.status(200).json({ message: null, data: examPools });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let examPools = await examPoolModel.find(filter);
    res.status(200).json({ message: null, data: examPools });
  },
  getById: function (req, res, next) {
    examPoolModel.findById(req.params.id, function (err, examPool) {
      if (err) {
        res.status(404).json({ message: "ExamPool not found", data: null });
      } else {
        res.status(200).json({ message: null, data: examPool });
      }
    });
  },
  updateById: function (req, res, next) {
    const examPool = req.body;
    examPoolModel.findByIdAndUpdate(req.params.id, examPool, function (
      err,
      examPoolInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "ExamPool updated successfully!", data: examPoolInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    examPoolModel.findByIdAndRemove(req.params.id, function (err, examPoolInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "ExamPool deleted successfully!", data: null });
      }
    });
  },
};
