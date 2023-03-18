const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  name: {
    type: Number,
    required: [true, "name is required."],
  },
  title: {
    type: String,
    required: [true, "title is required."],
  },
  description: {
    type: String,
    required: [true, "description is required."],
  },
  image: {
    type: String,
    required: [true, "image is required."],
  },
  video: {
    type: String,
    required: [true, "video is required."],
  },
  assignmentID: {
    type: Number,
    required: [true, "assignmentID is required."],
  },
  levelLength: {
    type: Number,
    required: [true, "levelLength is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Part");
module.exports = mongoose.model('Part', ModelSchema);
