const replitModel = require("../models/replit");

module.exports = {
  create: async function (req, res, next) {
    const replit = req.body;
    await replitModel.create(replit, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Replit added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let replits = await replitModel.find();
    res.status(200).json({ message: null, data: replits });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let replits = await replitModel.find(filter);
    res.status(200).json({ message: null, data: replits });
  },
  getById: function (req, res, next) {
    replitModel.findById(req.params.id, function (err, replit) {
      if (err) {
        res.status(404).json({ message: "Replit not found", data: null });
      } else {
        res.status(200).json({ message: null, data: replit });
      }
    });
  },
  updateById: function (req, res, next) {
    const replit = req.body;
    replitModel.findByIdAndUpdate(req.params.id, replit, function (
      err,
      replitInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Replit updated successfully!", data: replitInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    replitModel.findByIdAndRemove(req.params.id, function (err, replitInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Replit deleted successfully!", data: null });
      }
    });
  },
};
