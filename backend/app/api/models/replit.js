const mongoose = require('mongoose');
const unique = require('mongoose-unique-validator');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required."],
  },
  password: {
    type: String,
    required: [true, "password is required."],
  },
  userID: {
    type: Number,
    required: [true, "userID is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
});
ModelSchema.plugin(unique, { message: 'That {PATH} is already taken.' });
ModelSchema.plugin(autoIncrement.plugin, "Replit");
module.exports = mongoose.model('Replit', ModelSchema);
