const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  answer: {
    type: String,
    required: [true, "answer is required."],
  },
  question: {
    type: String,
    required: [true, "question is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "Question");
module.exports = mongoose.model('Question', ModelSchema);
