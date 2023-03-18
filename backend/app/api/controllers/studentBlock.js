const studentBlockModel = require("../models/studentBlock");

module.exports = {
  create: async function (req, res, next) {
    const studentBlock = req.body;
    await studentBlockModel.create(studentBlock, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "StudentBlock added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let studentBlocks = await studentBlockModel.find();
    res.status(200).json({ message: null, data: studentBlocks });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    console.log(filter)
    let studentBlocks = await studentBlockModel.find(filter);
    res.status(200).json({ message: null, data: studentBlocks });
  },
  getById: function (req, res, next) {
    studentBlockModel.findById(req.params.id, function (err, studentBlock) {
      if (err) {
        res.status(404).json({ message: "StudentBlock not found", data: null });
      } else {
        res.status(200).json({ message: null, data: studentBlock });
      }
    });
  },
  updateById: function (req, res, next) {
    const studentBlock = req.body;
    studentBlockModel.findByIdAndUpdate(req.params.id, studentBlock, function (
      err,
      studentBlockInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "StudentBlock updated successfully!", data: studentBlockInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    studentBlockModel.findByIdAndRemove(req.params.id, function (err, studentBlockInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "StudentBlock deleted successfully!", data: null });
      }
    });
  },
};
