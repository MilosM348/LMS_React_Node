const partGroupModel = require("../models/partGroup");

module.exports = {
  create: async function (req, res, next) {
    const partGroup = req.body;
    await partGroupModel.create(partGroup, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "PartGroup added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let partGroups = await partGroupModel.find();
    res.status(200).json({ message: null, data: partGroups });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let partGroups = await partGroupModel.find(filter);
    res.status(200).json({ message: null, data: partGroups });
  },
  getById: function (req, res, next) {
    partGroupModel.findById(req.params.id, function (err, partGroup) {
      if (err) {
        res.status(404).json({ message: "PartGroup not found", data: null });
      } else {
        res.status(200).json({ message: null, data: partGroup });
      }
    });
  },
  updateById: function (req, res, next) {
    const partGroup = req.body;
    partGroupModel.findByIdAndUpdate(req.params.id, partGroup, function (
      err,
      partGroupInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "PartGroup updated successfully!", data: partGroupInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    partGroupModel.findByIdAndRemove(req.params.id, function (err, partGroupInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "PartGroup deleted successfully!", data: null });
      }
    });
  },
};
