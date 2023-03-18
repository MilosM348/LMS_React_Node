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
  studentID: {
    type: Number,
    required: [true, "studentID is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
  levelID: {
    type: Number,
    required: [true, "levelID is required."],
  },
  levelState: {
    type: String,
    required: [true, "levelState is required."],
  },
  state: {
    type: String,
    required: [true, "state is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "AssignmentStudent");
module.exports = mongoose.model('AssignmentStudent', ModelSchema);
