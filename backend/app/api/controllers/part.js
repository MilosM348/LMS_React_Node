const partModel = require("../models/part");

module.exports = {
  create: async function (req, res, next) {
    const part = req.body;
    await partModel.create(part, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Part added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let parts = await partModel.find();
    res.status(200).json({ message: null, data: parts });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let parts = await partModel.find(filter);
    res.status(200).json({ message: null, data: parts });
  },
  getById: function (req, res, next) {
    partModel.findById(req.params.id, function (err, part) {
      if (err) {
        res.status(404).json({ message: "Part not found", data: null });
      } else {
        res.status(200).json({ message: null, data: part });
      }
    });
  },
  updateById: function (req, res, next) {
    const part = req.body;
    partModel.findByIdAndUpdate(req.params.id, part, function (
      err,
      partInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Part updated successfully!", data: partInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    partModel.findByIdAndRemove(req.params.id, function (err, partInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Part deleted successfully!", data: null });
      }
    });
  },
};
