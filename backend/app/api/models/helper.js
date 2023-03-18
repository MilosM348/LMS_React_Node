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
  avatar: {
    type: String,
    required: [true, "avatar is required."],
  },
  facebook: {
    type: String,
    required: [true, "facebook is required."],
  },
  twitter: {
    type: String,
    required: [true, "twitter is required."],
  },
  youtube: {
    type: String,
    required: [true, "youtube is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Helper");
module.exports = mongoose.model('Helper', ModelSchema);
