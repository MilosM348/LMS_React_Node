const mongoose = require('mongoose');
const unique = require("mongoose-unique-validator");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
    unique: true,
  },
  title: {
    type: String,
    required: [true, "title is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
  groupIDs: {
    type: [Number],
  },
  assignmentIDs: {
    type: [Number],
  },
  description: {
    type: String,
    required: [true, "description is required."],
  },
  simpleDescription: {
    type: String,
    required: [true, "simpleDescription is required."],
  },
  image: {
    type: String,
    required: [true, "image is required."],
  },
  price: {
    type: Number,
    required: [true, "price is required."],
  },
  review: {
    type: Number,
    required: [true, "review is required."],
  },
  ownerID: {
    type: Number,
    required: [true, "owner is required."],
  },
  inviteIDs: {
    type: [Number],
  },
  startDate: {
    type: String,
    required: [true, "startDate is required."],
  },
  endDate: {
    type: String,
    required: [true, "endDate is required."],
  },
  createdAt: {
    type: Date,
    required: [true, "createdAt is required."],
  },
});
ModelSchema.plugin(unique, { message: "That {PATH} is already taken." });
ModelSchema.plugin(autoIncrement.plugin, "VideoGroup");
module.exports = mongoose.model('VideoGroup', ModelSchema);
