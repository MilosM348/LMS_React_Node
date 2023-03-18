const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  name: {
    type: Number,
    required: [true, "name is required."],
  },
  levelID: {
    type: Number,
    required: [true, "levelID is required."],
  },
  code: {
    type: String,
    required: [true, "code is required."],
  },
  description: {
    type: String,
    required: [true, "description is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Program");
module.exports = mongoose.model('Program', ModelSchema);
