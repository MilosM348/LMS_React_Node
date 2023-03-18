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
  code: {
    type: String,
    required: [true, "code is required."],
  },
  isFree: {
    type: Boolean,
    required: [true, "isFree is required."],
  },
  discountPercentage: {
    type: Number,
    required: [true, "discountPercentage is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Coupon");
module.exports = mongoose.model('Coupon', ModelSchema);
