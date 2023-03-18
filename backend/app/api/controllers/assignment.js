const assignmentModel = require("../models/assignment");

module.exports = {
  create: async function (req, res, next) {
    const assignment = req.body;
    await assignmentModel.create(assignment, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Assignment added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let assignments = await assignmentModel.find();
    res.status(200).json({ message: null, data: assignments });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let assignments = await assignmentModel.find(filter);
    res.status(200).json({ message: null, data: assignments });
  },
  getById: function (req, res, next) {
    assignmentModel.findById(req.params.id, function (err, assignment) {
      if (err) {
        res.status(404).json({ message: "Assignment not found", data: null });
      } else {
        res.status(200).json({ message: null, data: assignment });
      }
    });
  },
  updateById: function (req, res, next) {
    const assignment = req.body;
    assignmentModel.findByIdAndUpdate(req.params.id, assignment, function (
      err,
      assignmentInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Assignment updated successfully!", data: assignmentInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    assignmentModel.findByIdAndRemove(req.params.id, function (err, assignmentInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Assignment deleted successfully!", data: null });
      }
    });
  },
};
