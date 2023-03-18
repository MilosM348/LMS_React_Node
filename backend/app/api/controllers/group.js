const groupModel = require("../models/group");

module.exports = {
  create: async function (req, res, next) {
    const group = req.body;
    await groupModel.create(group, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Group added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let groups = await groupModel.find();
    res.status(200).json({ message: null, data: groups });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let groups = await groupModel.find(filter);
    res.status(200).json({ message: null, data: groups });
  },
  getById: function (req, res, next) {
    groupModel.findById(req.params.id, function (err, group) {
      if (err) {
        res.status(404).json({ message: "Group not found", data: null });
      } else {
        res.status(200).json({ message: null, data: group });
      }
    });
  },
  updateById: function (req, res, next) {
    const group = req.body;
    groupModel.findByIdAndUpdate(req.params.id, group, function (
      err,
      groupInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Group updated successfully!", data: groupInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    groupModel.findByIdAndRemove(req.params.id, function (err, groupInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Group deleted successfully!", data: null });
      }
    });
  },
};
