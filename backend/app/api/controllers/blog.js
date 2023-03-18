const blogModel = require("../models/blog");

module.exports = {
  create: async function (req, res, next) {
    const blog = req.body;
    await blogModel.create(blog, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Blog added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let blogs = await blogModel.find();
    res.status(200).json({ message: null, data: blogs });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let blogs = await blogModel.find(filter);
    res.status(200).json({ message: null, data: blogs });
  },
  getById: function (req, res, next) {
    blogModel.findById(req.params.id, function (err, blog) {
      if (err) {
        res.status(404).json({ message: "Blog not found", data: null });
      } else {
        res.status(200).json({ message: null, data: blog });
      }
    });
  },
  updateById: function (req, res, next) {
    const blog = req.body;
    blogModel.findByIdAndUpdate(req.params.id, blog, function (
      err,
      blogInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Blog updated successfully!", data: blogInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    blogModel.findByIdAndRemove(req.params.id, function (err, blogInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Blog deleted successfully!", data: null });
      }
    });
  },
};
