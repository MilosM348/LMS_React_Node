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
  description: {
    type: String,
    required: [true, "description is required."],
  },
  companyNumber: {
    type: Number,
    required: [true, "companyNumber is required."],
  },
  countryNumber: {
    type: Number,
    required: [true, "countryNumber is required."],
  },
  studentNumber: {
    type: Number,
    required: [true, "studentNumber is required."],
  },
  challengeNumber: {
    type: Number,
    required: [true, "challengeNumber is required."],
  },
  image: {
    type: String,
    required: [true, "image is required."],
  },
  video: {
    type: String,
    required: [true, "video is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Aboutus");
module.exports = mongoose.model('Aboutus', ModelSchema);
