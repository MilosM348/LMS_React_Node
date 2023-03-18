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
    required: [true, "url is required."]
  }
})
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
  files: {
    type: [FileSchema],
    required: [true, "files is required."],
  },
  resDescription: {
    type: String,
    required: [true, "resDescription is required."],
  },
  resImage: {
    type: String,
    required: [true, "resImage is required."],
  },
  resVideo: {
    type: String,
    required: [true, "resVideo is required."],
  },
  partID: {
    type: Number,
    required: [true, "partID is required."],
  },
  resFiles: {
    type: [FileSchema],
    required: [true, "resFiles is required."],
  },
  programLength: {
    type: Number,
    required: [true, "programLength is required."],
  },
  examLength: {
    type: Number,
    required: [true, "examLength is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Level");
module.exports = mongoose.model('Level', ModelSchema);
