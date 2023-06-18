const campusModel = require("../models/campus");

module.exports = {
  create: async function (req, res, next) {
    const campus = req.body;
    await campusModel.create(campus, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Campus added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let campus = await campusModel.find();
    res.status(200).json({ message: null, data: campus });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let campus = await campusModel.find(filter);
    res.status(200).json({ message: null, data: campus });
  },
  getById: function (req, res, next) {
    campusModel.findById(req.params.id, function (err, campus) {
      if (err) {
        res.status(404).json({ message: "Campus not found", data: null });
      } else {
        res.status(200).json({ message: null, data: campus });
      }
    });
  },
  updateById: function (req, res, next) {
    const campus = req.body;
    campusModel.findByIdAndUpdate(req.params.id, campus, function (
      err,
      campusInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Campus updated successfully!", data: campusInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    campusModel.findByIdAndRemove(req.params.id, function (err, campusInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Campus deleted successfully!", data: null });
      }
    });
  },
};
