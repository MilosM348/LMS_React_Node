const featureModel = require("../models/feature");

module.exports = {
  create: async function (req, res, next) {
    const feature = req.body;
    await featureModel.create(feature, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Feature added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let features = await featureModel.find();
    res.status(200).json({ message: null, data: features });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let features = await featureModel.find(filter);
    res.status(200).json({ message: null, data: features });
  },
  getById: function (req, res, next) {
    featureModel.findById(req.params.id, function (err, feature) {
      if (err) {
        res.status(404).json({ message: "Feature not found", data: null });
      } else {
        res.status(200).json({ message: null, data: feature });
      }
    });
  },
  updateById: function (req, res, next) {
    const feature = req.body;
    featureModel.findByIdAndUpdate(req.params.id, feature, function (
      err,
      featureInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Feature updated successfully!", data: featureInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    featureModel.findByIdAndRemove(req.params.id, function (err, featureInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Feature deleted successfully!", data: null });
      }
    });
  },
};
