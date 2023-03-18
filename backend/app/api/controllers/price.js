const priceModel = require("../models/price");

module.exports = {
  create: async function (req, res, next) {
    const price = req.body;
    await priceModel.create(price, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Price added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let prices = await priceModel.find();
    res.status(200).json({ message: null, data: prices });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let prices = await priceModel.find(filter);
    res.status(200).json({ message: null, data: prices });
  },
  getById: function (req, res, next) {
    priceModel.findById(req.params.id, function (err, price) {
      if (err) {
        res.status(404).json({ message: "Price not found", data: null });
      } else {
        res.status(200).json({ message: null, data: price });
      }
    });
  },
  updateById: function (req, res, next) {
    const price = req.body;
    priceModel.findByIdAndUpdate(req.params.id, price, function (
      err,
      priceInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Price updated successfully!", data: priceInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    priceModel.findByIdAndRemove(req.params.id, function (err, priceInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Price deleted successfully!", data: null });
      }
    });
  },
};
