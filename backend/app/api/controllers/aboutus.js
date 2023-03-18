const aboutusModel = require("../models/aboutus");

module.exports = {
  create: async function (req, res, next) {
    const aboutus = req.body;
    await aboutusModel.create(aboutus, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Aboutus added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let aboutus = await aboutusModel.find();
    res.status(200).json({ message: null, data: aboutus });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let aboutus = await aboutusModel.find(filter);
    res.status(200).json({ message: null, data: aboutus });
  },
  getById: function (req, res, next) {
    aboutusModel.findById(req.params.id, function (err, aboutus) {
      if (err) {
        res.status(404).json({ message: "Aboutus not found", data: null });
      } else {
        res.status(200).json({ message: null, data: aboutus });
      }
    });
  },
  updateById: function (req, res, next) {
    const aboutus = req.body;
    aboutusModel.findByIdAndUpdate(req.params.id, aboutus, function (
      err,
      aboutusInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Aboutus updated successfully!", data: aboutusInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    aboutusModel.findByIdAndRemove(req.params.id, function (err, aboutusInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Aboutus deleted successfully!", data: null });
      }
    });
  },
};
