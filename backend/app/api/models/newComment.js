const mongoose = require('mongoose');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const Schema = mongoose.Schema;
//Define a schema
const ModelSchema = new Schema({
  commentID: {
    type: Number,
    required: [true, "commentID is required."],
  },
  levelID: {
    type: Number,
    required: [true, "levelID is required."],
  },
  userID: {
    type: Number,
    required: [true, "userID is required."],
  },
  ownerID: {
    type: Number,
    required: [true, "ownerID is required."],
  },
  companyID: {
    type: Number,
    required: [true, "companyID is required."],
  },
});
ModelSchema.plugin(autoIncrement.plugin, "NewComment");
module.exports = mongoose.model('NewComment', ModelSchema);
