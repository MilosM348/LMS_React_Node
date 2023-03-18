const levelModel = require("../models/level");

module.exports = {
  create: async function (req, res, next) {
    const level = req.body;
    await levelModel.create(level, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Level added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let levels = await levelModel.find();
    res.status(200).json({ message: null, data: levels });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let levels = await levelModel.find(filter);
    res.status(200).json({ message: null, data: levels });
  },
  getById: function (req, res, next) {
    levelModel.findById(req.params.id, function (err, level) {
      if (err) {
        res.status(404).json({ message: "Level not found", data: null });
      } else {
        res.status(200).json({ message: null, data: level });
      }
    });
  },
  updateById: function (req, res, next) {
    const level = req.body;
    levelModel.findByIdAndUpdate(req.params.id, level, function (
      err,
      levelInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Level updated successfully!", data: levelInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    levelModel.findByIdAndRemove(req.params.id, function (err, levelInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Level deleted successfully!", data: null });
      }
    });
  },
};
