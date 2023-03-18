const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const unique = require('mongoose-unique-validator');
const validate = require('mongoose-validator');
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);
const saltRounds = 10;

const Schema = mongoose.Schema;
const emailValidator = [
  validate({
    validator: 'isLength',
    arguments: [0, 40],
    message: 'Email must not exceed {ARGS[1]} characters.'
  }),
  validate({
    validator: 'isEmail',
    message: 'Email must be valid.'
  })
];
//Define a schema
const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "email is required."],
    validate: emailValidator,
  },
  name: {
    type: String,
    required: [true, "name is required."],
  },
  firstName: {
    type: String,
    required: [true, "firstName is required."],
  },
  lastName: {
    type: String,
    required: [true, "lastName is required."],
  },
  password: {
    type: String,
    required: [true, "password is required."],
  },
  role: {
    type: String,
    required: [true, "role is required."],
  },
  phone: {
    type: String,
  },
  country: {
    type: String,
  },
  avatar: {
    type: String,
  },
  helpline: {
    type: Number,
    required: [true, "helpline is required."],
  },
  confirm: {
    type: Boolean,
    required: [true, "confirm is required."],
  },
  activate: {
    type: Boolean,
    required: [true, "activate is required."],
  },
  companyID: {
    type: Number,
    required: [true, "activate is required."],
  },
});
UserSchema.plugin(unique, { message: 'That {PATH} is already taken.' });
UserSchema.plugin(autoIncrement.plugin, "User");
UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});
module.exports = mongoose.model('User', UserSchema);
