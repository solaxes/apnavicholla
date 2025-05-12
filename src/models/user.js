const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  age: {
    type: Number,
  },
  gender: {
    type: String,
  },
});

/**
 * Generate JWT token for the user
 *
 * @returns
 */
userSchema.methods.getJWT = async function () {
  const token = await jwt.sign({ id: this._id }, "apnavicholla@123", {
    expiresIn: "1h",
  });

  return token;
};

/**
 * Validate password compared with the hashed password
 *
 * @param {*} userPassword
 * @returns
 */
userSchema.methods.validatePassword = async function (userPassword) {
  const isMatch = await bcrypt.compare(userPassword, this.password);
  return isMatch;
};

const User = mongoose.model('User', userSchema);

module.exports = User;