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
  avatar: {
    type: String,
    required: [true, "avatar is required."],
  },
  authorName: {
    type: String,
    required: [true, "authorName is required."],
  },
  authorTitle: {
    type: String,
    required: [true, "authorTitle is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Testimonial");
module.exports = mongoose.model('Testimonial', ModelSchema);
