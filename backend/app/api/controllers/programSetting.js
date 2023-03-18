const programSettingModel = require("../models/programSetting");

module.exports = {
  create: async function (req, res, next) {
    const programSetting = req.body;
    await programSettingModel.create(programSetting, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "ProgramSetting added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let programSettings = await programSettingModel.find();
    res.status(200).json({ message: null, data: programSettings });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let programSettings = await programSettingModel.find(filter);
    res.status(200).json({ message: null, data: programSettings });
  },
  getById: function (req, res, next) {
    programSettingModel.findById(req.params.id, function (err, programSetting) {
      if (err) {
        res.status(404).json({ message: "ProgramSetting not found", data: null });
      } else {
        res.status(200).json({ message: null, data: programSetting });
      }
    });
  },
  updateById: function (req, res, next) {
    const programSetting = req.body;
    programSettingModel.findByIdAndUpdate(req.params.id, programSetting, function (
      err,
      programSettingInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "ProgramSetting updated successfully!", data: programSettingInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    programSettingModel.findByIdAndRemove(req.params.id, function (err, programSettingInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "ProgramSetting deleted successfully!", data: null });
      }
    });
  },
};
