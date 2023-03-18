const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  firstTitle: {
    type: String,
    required: [true, "firstTitle is required."],
  },
  firstDescription: {
    type: String,
    required: [true, "firstDescription is required."],
  },
  secondTitle: {
    type: String,
    required: [true, "secondTitle is required."],
  },
  secondDescription: {
    type: String,
    required: [true, "secondDescription is required."],
  },
  thirdTitle: {
    type: String,
    required: [true, "thirdTitle is required."],
  },
  thirdDescription: {
    type: String,
    required: [true, "thirdDescription is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "IconBox");
module.exports = mongoose.model('IconBox', ModelSchema);
