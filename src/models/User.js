/**
 * Created by bolorundurowb on 1/7/17.
 */

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import shortid from 'shortid';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  username: {
    type: String,
    required: true,
    unique: true
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
    required: true,
    unique: true
  },
  hashedPassword: {
    type: String,
    required: true
  },
  profilePhoto: {
    type: String
  },
  joined: {
    type: Date,
    default: Date.now
  },
  role: {
    type: Number,
    ref: 'Role',
    default: 1
  }
});

userSchema.virtual('password').get(function () {
  return this.hashedPassword;
});

userSchema.virtual('password').set(function (plainText) {
  const salt = bcrypt.genSaltSync(10);
  this.hashedPassword = bcrypt.hashSync(plainText, salt);
});

const userModel = mongoose.model('User', userSchema);

export default userModel;
