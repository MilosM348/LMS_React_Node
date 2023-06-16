const eventModel = require("../models/event");

module.exports = {
  create: async function (req, res, next) {
    const event = req.body;
    await eventModel.create(event, function (err, result) {
      if (err) {
        if (err.errors) {
          res.status(400).json({ message: 'Require data', errors: err.errors });
        } else {
          res.status(500).json({ message: "Internal server error", data: null });
        }
      } else {
        res.status(200).json({
          message: "Event added successfully!!!",
          data: { id: result._id },
        });
      }
    });
  },
  getAll: async function (req, res, next) {
    let events = await eventModel.find();
    res.status(200).json({ message: null, data: events });
  },
  getFilter: async function (req, res, next) {
    const filter = req.body;
    let events = await eventModel.find(filter);
    res.status(200).json({ message: null, data: events });
  },
  getById: function (req, res, next) {
    eventModel.findById(req.params.id, function (err, event) {
      if (err) {
        res.status(404).json({ message: "Event not found", data: null });
      } else {
        res.status(200).json({ message: null, data: event });
      }
    });
  },
  updateById: function (req, res, next) {
    const event = req.body;
    eventModel.findByIdAndUpdate(req.params.id, event, function (
      err,
      eventInfo
    ) {
      if (err) res.status(400).json({ message: "Update failed", data: null });
      else {
        res
          .status(200)
          .json({ message: "Event updated successfully!", data: eventInfo });
      }
    });
  },
  deleteById: function (req, res, next) {
    eventModel.findByIdAndRemove(req.params.id, function (err, eventInfo) {
      if (err) res.status(400).json({ message: "Delete failed", data: null });
      else {
        res.status(200).json({ message: "Event deleted successfully!", data: null });
      }
    });
  },
};
