const couponModel = require("../models/coupon");

module.exports = {
  create: async function (req, res, next) {
    const coupon = req.body;
    await couponModel.create(coupon, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Coupon added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let coupons = await couponModel.find();
    res.status(200).json({ message: null, data: coupons });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let coupons = await couponModel.find(filter);
    res.status(200).json({ message: null, data: coupons });
  },
  getById: function (req, res, next) {
    couponModel.findById(req.params.id, function (err, coupon) {
      if (err) {
        res.status(404).json({ message: "Coupon not found", data: null });
      } else {
        res.status(200).json({ message: null, data: coupon });
      }
    });
  },
  updateById: function (req, res, next) {
    const coupon = req.body;
    couponModel.findByIdAndUpdate(req.params.id, coupon, function (
      err,
      couponInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Coupon updated successfully!", data: couponInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    couponModel.findByIdAndRemove(req.params.id, function (err, couponInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Coupon deleted successfully!", data: null });
      }
    });
  },
};
