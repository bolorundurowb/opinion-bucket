/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opinionSchema = new Schema({
  authorName: String,
  authorUsername: String,
  showName: Boolean,
  details: String,
  date: {
    type: Date,
    default: Date.now
  },
  likes: Number,
  dislikes: Number
});

module.exports = opinionSchema;
