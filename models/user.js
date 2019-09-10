const mongoose = require("mongoose");
const Joi = require('@hapi/joi');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    minlength: 3,
    maxlength: 255,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    minlength: 6,
    maxlength: 255,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  isAdmin: {
      type: Boolean,
      default: false
  }
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    firstName: Joi.string()
      .min(3)
      .max(255)
      .required(),
    lastName: Joi.string()
      .min(3)
      .max(255)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

function validateUserLogin(user) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(3)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validateUser = validateUser;
module.exports.validateLogin = validateUserLogin;
