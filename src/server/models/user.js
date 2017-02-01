/**
 * Created by bolorundurowb on 1/7/17.
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    default: Date.now
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Decline'],
    default: 'Decline'
  },
  email: {
    type: String,
    required: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  profilePhoto: String,
  joined: {
    type: Date
  },
  topics: [{
    type: Schema.ObjectId,
    ref: 'Topic'
  }],
  type: {
    type: String,
    enum: ['User', 'Admin'],
    default: 'User'
  }
});

userSchema.virtual('name').get(function () {
  return this.firstName + ' ' + this.lastName;
});

userSchema.virtual('password').get(function () {
  return this.hashedPassword;
});

userSchema.virtual('password').set(function (plainText) {
  const salt = bcrypt.genSaltSync(10);
  this.hashedPassword = bcrypt.hashSync(plainText, salt);
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
