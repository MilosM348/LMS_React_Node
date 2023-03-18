const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
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
    required: [true, "levelID is required."],
  },
  examID: {
    type: Number,
    required: [true, "examID is required."],
  },
  state: {
    type: String,
    required: [true, "state is required."],
  },
  startTime: {
    type: Date,
  },
});
ModelSchema.plugin(autoIncrement.plugin, "ExamPool");
module.exports = mongoose.model('ExamPool', ModelSchema);
