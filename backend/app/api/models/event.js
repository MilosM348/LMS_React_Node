const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  title: {
    type: String,
    required: [true, "title is required."],
  },
  startTime: {
    type: String,
    required: [true, "startTime is required."],
  },
  endTime: {
    type: String,
    required: [true, "endTime is required."],
  },
  location: {
    type: String,
    required: [true, "location is required."],
  },
  description: {
    type: String,
    required: [true, "description is required."],
  },
  month: {
    type: Number,
    required: [true, "month is required."],
  },
  day: {
    type: Number,
    required: [true, "day is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Event");
module.exports = mongoose.model('Event', ModelSchema);
