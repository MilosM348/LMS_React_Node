const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  description: {
    type: String,
    required: [true, "description is required."],
  },
  fileUrl: {
    type: String,
  },
  isFile: {
    type: Boolean,
    required: [true, "isFile is required."],
  },
  from: {
    type: Number,
    required: [true, "from is required."],
  },
  to: {
    type: Number,
    required: [true, "to is required."],
  },
  assignmentID: {
    type: Number,
    required: [true, "assignmentID is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt is required."]
  }
});
ModelSchema.plugin(autoIncrement.plugin, "Message");
module.exports = mongoose.model('Message', ModelSchema);
