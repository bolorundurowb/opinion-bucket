/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: String,
  details: String,
  date: {
    type: Date,
    default: Date.now
  },
  likes: Number,
  dislikes: Number
});

module.exports = commentSchema;
