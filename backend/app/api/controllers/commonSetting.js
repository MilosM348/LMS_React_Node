const commonSettingModel = require("../models/commonSetting");

module.exports = {
  create: async function (req, res, next) {
    const commonSetting = req.body;
    await commonSettingModel.create(commonSetting, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "CommonSetting added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let commonSetting = await commonSettingModel.find();
    res.status(200).json({ message: null, data: commonSetting });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let commonSetting = await commonSettingModel.find(filter);
    res.status(200).json({ message: null, data: commonSetting });
  },
  getById: function (req, res, next) {
    commonSettingModel.findById(req.params.id, function (err, commonSetting) {
      if (err) {
        res.status(404).json({ message: "CommonSetting not found", data: null });
      } else {
        res.status(200).json({ message: null, data: commonSetting });
      }
    });
  },
  updateById: function (req, res, next) {
    const commonSetting = req.body;
    commonSettingModel.findByIdAndUpdate(req.params.id, commonSetting, function (
      err,
      commonSettingInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "CommonSetting updated successfully!", data: commonSettingInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    commonSettingModel.findByIdAndRemove(req.params.id, function (err, commonSettingInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "CommonSetting deleted successfully!", data: null });
      }
    });
  },
};
