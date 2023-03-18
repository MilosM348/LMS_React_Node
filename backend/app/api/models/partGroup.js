const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  partID: {
    type: Number,
    required: [true, "partID is required."],
  },
  sourceID: {
    type: Number,
    required: [true, "sourceID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "PartGroup");
module.exports = mongoose.model('PartGroup', ModelSchema);
