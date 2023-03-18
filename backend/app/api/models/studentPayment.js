const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  priceID: {
    type: Number,
    required: [true, "priceID is required."],
  },
  studentID: {
    type: Number,
    required: [true, "studentID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "StudentPayment");
module.exports = mongoose.model('StudentPayment', ModelSchema);
