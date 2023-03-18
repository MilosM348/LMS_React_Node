const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  studentID: {
    type: Number,
    required: [true, "studentID is required."],
  },
  assignmentID: {
    type: Number,
    required: [true, "assignmentID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "StudentBlock");
module.exports = mongoose.model('StudentBlock', ModelSchema);
