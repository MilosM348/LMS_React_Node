const subjectModel = require("../models/subject");

module.exports = {
  create: async function (req, res, next) {
    const subject = req.body;
    await subjectModel.create(subject, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Subject added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let subjects = await subjectModel.find();
    res.status(200).json({ message: null, data: subjects });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let subjects = await subjectModel.find(filter);
    res.status(200).json({ message: null, data: subjects });
  },
  getById: function (req, res, next) {
    subjectModel.findById(req.params.id, function (err, subject) {
      if (err) {
        res.status(404).json({ message: "Subject not found", data: null });
      } else {
        res.status(200).json({ message: null, data: subject });
      }
    });
  },
  updateById: function (req, res, next) {
    const subject = req.body;
    subjectModel.findByIdAndUpdate(req.params.id, subject, function (
      err,
      subjectInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Subject updated successfully!", data: subjectInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    subjectModel.findByIdAndRemove(req.params.id, function (err, subjectInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Subject deleted successfully!", data: null });
      }
    });
  },
};
