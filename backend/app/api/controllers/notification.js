const notificationModel = require("../models/notification");

module.exports = {
  create: async function (req, res, next) {
    const notification = req.body;
    await notificationModel.create(notification, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Notification added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let notifications = await notificationModel.find();
    res.status(200).json({ message: null, data: notifications });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let notifications = await notificationModel.find(filter);
    res.status(200).json({ message: null, data: notifications });
  },
  getById: function (req, res, next) {
    notificationModel.findById(req.params.id, function (err, notification) {
      if (err) {
        res.status(404).json({ message: "Notification not found", data: null });
      } else {
        res.status(200).json({ message: null, data: notification });
      }
    });
  },
  updateById: function (req, res, next) {
    const notification = req.body;
    notificationModel.findByIdAndUpdate(req.params.id, notification, function (
      err,
      notificationInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Notification updated successfully!", data: notificationInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    notificationModel.findByIdAndRemove(req.params.id, function (err, notificationInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Notification deleted successfully!", data: null });
      }
    });
  },
};
