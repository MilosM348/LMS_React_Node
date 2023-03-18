const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  location: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  facebook: {
    type: String,
  },
  twitter: {
    type: String,
  },
  linkedin: {
    type: String,
  },
  instagram: {
    type: String,
  },
  youtube: {
    type: String,
  },
  pinterest: {
    type: String,
  },
});
ModelSchema.plugin(autoIncrement.plugin, "CommonSetting");
module.exports = mongoose.model('CommonSetting', ModelSchema);
