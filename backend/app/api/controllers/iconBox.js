const iconBoxModel = require("../models/iconBox");

module.exports = {
  create: async function (req, res, next) {
    const iconBox = req.body;
    await iconBoxModel.create(iconBox, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "IconBox added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let iconBoxs = await iconBoxModel.find();
    res.status(200).json({ message: null, data: iconBoxs });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let iconBoxs = await iconBoxModel.find(filter);
    res.status(200).json({ message: null, data: iconBoxs });
  },
  getById: function (req, res, next) {
    iconBoxModel.findById(req.params.id, function (err, iconBox) {
      if (err) {
        res.status(404).json({ message: "IconBox not found", data: null });
      } else {
        res.status(200).json({ message: null, data: iconBox });
      }
    });
  },
  updateById: function (req, res, next) {
    const iconBox = req.body;
    iconBoxModel.findByIdAndUpdate(req.params.id, iconBox, function (
      err,
      iconBoxInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "IconBox updated successfully!", data: iconBoxInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    iconBoxModel.findByIdAndRemove(req.params.id, function (err, iconBoxInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "IconBox deleted successfully!", data: null });
      }
    });
  },
};
