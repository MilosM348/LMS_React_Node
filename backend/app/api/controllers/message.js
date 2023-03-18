const messageModel = require("../models/message");

module.exports = {
  create: async function (req, res, next) {
    const message = req.body;
    await messageModel.create(message, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Message added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let messages = await messageModel.find();
    res.status(200).json({ message: null, data: messages });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let messages = await messageModel.find(filter);
    res.status(200).json({ message: null, data: messages });
  },
  getById: function (req, res, next) {
    messageModel.findById(req.params.id, function (err, message) {
      if (err) {
        res.status(404).json({ message: "Message not found", data: null });
      } else {
        res.status(200).json({ message: null, data: message });
      }
    });
  },
  updateById: function (req, res, next) {
    const message = req.body;
    messageModel.findByIdAndUpdate(req.params.id, message, function (
      err,
      messageInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Message updated successfully!", data: messageInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    messageModel.findByIdAndRemove(req.params.id, function (err, messageInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Message deleted successfully!", data: null });
      }
    });
  },
};
