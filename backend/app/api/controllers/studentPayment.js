const studentPaymentModel = require("../models/studentPayment");

module.exports = {
  create: async function (req, res, next) {
    const studentPayment = req.body;
    await studentPaymentModel.create(studentPayment, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "StudentPayment added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let studentPayments = await studentPaymentModel.find();
    res.status(200).json({ message: null, data: studentPayments });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let studentPayments = await studentPaymentModel.find(filter);
    res.status(200).json({ message: null, data: studentPayments });
  },
  getById: function (req, res, next) {
    studentPaymentModel.findById(req.params.id, function (err, studentPayment) {
      if (err) {
        res.status(404).json({ message: "StudentPayment not found", data: null });
      } else {
        res.status(200).json({ message: null, data: studentPayment });
      }
    });
  },
  updateById: function (req, res, next) {
    const studentPayment = req.body;
    studentPaymentModel.findByIdAndUpdate(req.params.id, studentPayment, function (
      err,
      studentPaymentInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "StudentPayment updated successfully!", data: studentPaymentInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    studentPaymentModel.findByIdAndRemove(req.params.id, function (err, studentPaymentInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "StudentPayment deleted successfully!", data: null });
      }
    });
  },
};
