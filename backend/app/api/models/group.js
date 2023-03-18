const mongoose = require('mongoose');
const unique = require("mongoose-unique-validator");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
    unique: true,
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
  learnerIDs: {
    type: [Number],
  },
});
ModelSchema.plugin(unique, { message: "That {PATH} is already taken." });
ModelSchema.plugin(autoIncrement.plugin, "Group");
module.exports = mongoose.model('Group', ModelSchema);
