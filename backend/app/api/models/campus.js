const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  image: {
    type: String,
    required: [true, "image is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Campus");
module.exports = mongoose.model('Campus', ModelSchema);
