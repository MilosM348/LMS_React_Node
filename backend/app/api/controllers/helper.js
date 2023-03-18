const helperModel = require("../models/helper");

module.exports = {
  create: async function (req, res, next) {
    const helper = req.body;
    await helperModel.create(helper, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Helper added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let helpers = await helperModel.find();
    res.status(200).json({ message: null, data: helpers });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let helpers = await helperModel.find(filter);
    res.status(200).json({ message: null, data: helpers });
  },
  getById: function (req, res, next) {
    helperModel.findById(req.params.id, function (err, helper) {
      if (err) {
        res.status(404).json({ message: "Helper not found", data: null });
      } else {
        res.status(200).json({ message: null, data: helper });
      }
    });
  },
  updateById: function (req, res, next) {
    const helper = req.body;
    helperModel.findByIdAndUpdate(req.params.id, helper, function (
      err,
      helperInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Helper updated successfully!", data: helperInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    helperModel.findByIdAndRemove(req.params.id, function (err, helperInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Helper deleted successfully!", data: null });
      }
    });
  },
};
