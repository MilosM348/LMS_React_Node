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
  levelID: {
    type: Number,
    required: [true, "levelID is required."],
  },
  userID: {
    type: Number,
    required: [true, "userID is required."],
  },
  ownerID: {
    type: Number,
    required: [true, "ownerID is required."],
  },
  isOwner: {
    type: Boolean,
    required: [true, "isOwner is required."],
  },
  isFile: {
    type: Boolean,
    required: [true, "isFile is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Comment");
module.exports = mongoose.model('Comment', ModelSchema);
