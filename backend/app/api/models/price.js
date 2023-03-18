const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  price: {
    type: Number,
    required: [true, "price is required."],
  },
  type: {
    type: String,
    required: [true, "type is required."],
  },
  assignmentID: {
    type: Number,
    required: [true, "assignmentID is required."],
  },
  sourceID: {
    type: Number,
    required: [true, "sourceID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Price");
module.exports = mongoose.model('Price', ModelSchema);
