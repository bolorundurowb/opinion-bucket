/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const opinionSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  author: {
    type: String,
    required: true,
    ref: 'User'
  },
  showName: {
    type: Boolean,
    default: false
  },
  content: {
    type: String
  },
  title: {
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
  },
  topicId: {
    type: String,
    required: true,
    ref: 'Topic'
  }
});

const opinionModel = mongoose.model('Opinion', opinionSchema);

export default opinionModel;
