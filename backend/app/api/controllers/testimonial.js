const testimonialModel = require("../models/testimonial");

module.exports = {
  create: async function (req, res, next) {
    const testimonial = req.body;
    await testimonialModel.create(testimonial, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Testimonial added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let testimonials = await testimonialModel.find();
    res.status(200).json({ message: null, data: testimonials });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let testimonials = await testimonialModel.find(filter);
    res.status(200).json({ message: null, data: testimonials });
  },
  getById: function (req, res, next) {
    testimonialModel.findById(req.params.id, function (err, testimonial) {
      if (err) {
        res.status(404).json({ message: "Testimonial not found", data: null });
      } else {
        res.status(200).json({ message: null, data: testimonial });
      }
    });
  },
  updateById: function (req, res, next) {
    const testimonial = req.body;
    testimonialModel.findByIdAndUpdate(req.params.id, testimonial, function (
      err,
      testimonialInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Testimonial updated successfully!", data: testimonialInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    testimonialModel.findByIdAndRemove(req.params.id, function (err, testimonialInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Testimonial deleted successfully!", data: null });
      }
    });
  },
};
