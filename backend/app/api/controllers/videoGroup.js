const videoGroupModel = require("../models/videoGroup");

module.exports = {
  create: async function (req, res, next) {
    const videoGroup = req.body;
    videoGroup.createdAt = new Date()
    await videoGroupModel.create(videoGroup, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Video Group added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let videoGroups = await videoGroupModel.find();
    res.status(200).json({ message: null, data: videoGroups });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let videoGroups = await videoGroupModel.find(filter);
    res.status(200).json({ message: null, data: videoGroups });
  },
  getById: function (req, res, next) {
    videoGroupModel.findById(req.params.id, function (err, videoGroup) {
      if (err) {
        res.status(404).json({ message: "Video Group not found", data: null });
      } else {
        res.status(200).json({ message: null, data: videoGroup });
      }
    });
  },
  updateById: function (req, res, next) {
    const videoGroup = req.body;
    videoGroupModel.findByIdAndUpdate(req.params.id, videoGroup, function (
      err,
      videoGroupInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Video Group updated successfully!", data: videoGroupInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    videoGroupModel.findByIdAndRemove(req.params.id, function (err, videoGroupInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Video Group deleted successfully!", data: null });
      }
    });
  },
};
