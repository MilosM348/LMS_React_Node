const sliderModel = require("../models/slider");

module.exports = {
  create: async function (req, res, next) {
    const slider = req.body;
    await sliderModel.create(slider, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Slider added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let sliders = await sliderModel.find();
    res.status(200).json({ message: null, data: sliders });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let sliders = await sliderModel.find(filter);
    res.status(200).json({ message: null, data: sliders });
  },
  getById: function (req, res, next) {
    sliderModel.findById(req.params.id, function (err, slider) {
      if (err) {
        res.status(404).json({ message: "Slider not found", data: null });
      } else {
        res.status(200).json({ message: null, data: slider });
      }
    });
  },
  updateById: function (req, res, next) {
    const slider = req.body;
    sliderModel.findByIdAndUpdate(req.params.id, slider, function (
      err,
      sliderInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Slider updated successfully!", data: sliderInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    sliderModel.findByIdAndRemove(req.params.id, function (err, sliderInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Slider deleted successfully!", data: null });
      }
    });
  },
};
