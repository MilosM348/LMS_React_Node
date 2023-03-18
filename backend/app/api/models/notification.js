const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const FileSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
  url: {
    type: String,
    required: [true, "url is required."],
  },
});
const ModelSchema = new Schema({
  assignmentID: {
    type: Number,
    required: [true, "assignmentID is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
  studentID: {
    type: Number,
    required: [true, "studentID is required."],
  },
  levelID: {
    type: Number,
    required: [true, "levelId is required."],
  },
  files: {
    type: [FileSchema],
    required: [true, "files is required."],
  },
  state: {
    type: String,
    required: [true, "state is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Notification");
module.exports = mongoose.model('Notification', ModelSchema);
