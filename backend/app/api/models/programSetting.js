const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  joinLink: {
    type: String,
    required: [true, "joinLink is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "ProgramSetting");
module.exports = mongoose.model('ProgramSetting', ModelSchema);
