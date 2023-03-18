const assignmentStudentModel = require("../models/assignmentStudent");

module.exports = {
  create: async function (req, res, next) {
    const assignmentStudent = req.body;
    await assignmentStudentModel.create(assignmentStudent, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "AssignmentStudent added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let assignmentStudents = await assignmentStudentModel.find();
    res.status(200).json({ message: null, data: assignmentStudents });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let assignmentStudents = await assignmentStudentModel.find(filter);
    res.status(200).json({ message: null, data: assignmentStudents });
  },
  getById: function (req, res, next) {
    assignmentStudentModel.findById(req.params.id, function (err, assignmentStudent) {
      if (err) {
        res.status(404).json({ message: "AssignmentStudent not found", data: null });
      } else {
        res.status(200).json({ message: null, data: assignmentStudent });
      }
    });
  },
  updateById: function (req, res, next) {
    const assignmentStudent = req.body;
    assignmentStudentModel.findByIdAndUpdate(req.params.id, assignmentStudent, function (
      err,
      assignmentStudentInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "AssignmentStudent updated successfully!", data: assignmentStudentInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    assignmentStudentModel.findByIdAndRemove(req.params.id, function (err, assignmentStudentInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "AssignmentStudent deleted successfully!", data: null });
      }
    });
  },
};
