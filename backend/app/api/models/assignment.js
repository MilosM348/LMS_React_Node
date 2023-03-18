const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  name: {
    type: String,
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
  fee: {
    type: Number,
    required: [true, "fee is required."],
  },
  image: {
    type: String,
    required: [true, "image is required."],
  },
  ownerID: {
    type: Number,
    required: [true, "ownerID is required."],
  },
  activate: {
    type: Boolean,
    required: [true, "activate is required."],
  },
  submit: {
    type: Boolean,
    required: [true, "submit is required."],
  },
  review: {
    type: Number,
    required: [true, "review is required."],
  },
  studentNumber: {
    type: Number,
    required: [true, "studentNumber is required."],
  },
  startDate: {
    type: String,
    required: [true, "startDate is required."],
  },
  duration: {
    type: String,
    required: [true, "duration is required."],
  },
  language: {
    type: String,
    required: [true, "language is required."],
  },
  skillLevel: {
    type: String,
    required: [true, "skillLevel is required."],
  },
  subject: {
    type: String,
    required: [true, "subject is required."],
  },
  lectures: {
    type: Number,
    required: [true, "lectures is required."],
  },
  enrolled: {
    type: Number,
    required: [true, "enrolled is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Assignment");
module.exports = mongoose.model('Assignment', ModelSchema);
