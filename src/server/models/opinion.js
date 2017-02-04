/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const opinionSchema = new Schema({
  author: {
    type: Schema.ObjectId,
    required: true,
    ref: 'User'
  },
  showName: {
    type: Boolean,
    default: false
  },
  details: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  }
});

const opinionModel = mongoose.model('Opinion', opinionSchema);

module.exports = opinionModel;
