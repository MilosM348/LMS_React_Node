const programModel = require("../models/program");

module.exports = {
  create: async function (req, res, next) {
    const program = req.body;
    await programModel.create(program, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Program added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let programs = await programModel.find();
    res.status(200).json({ message: null, data: programs });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let programs = await programModel.find(filter);
    res.status(200).json({ message: null, data: programs });
  },
  getById: function (req, res, next) {
    programModel.findById(req.params.id, function (err, program) {
      if (err) {
        res.status(404).json({ message: "Program not found", data: null });
      } else {
        res.status(200).json({ message: null, data: program });
      }
    });
  },
  updateById: function (req, res, next) {
    const program = req.body;
    programModel.findByIdAndUpdate(req.params.id, program, function (
      err,
      programInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Program updated successfully!", data: programInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    programModel.findByIdAndRemove(req.params.id, function (err, programInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Program deleted successfully!", data: null });
      }
    });
  },
};
