/**
 * Created by bolorundurowb on 1/7/17.
 */

import mongoose from 'mongoose';
import shortid from 'shortid';

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
    number: {
      type: Number,
      default: 0
    },
    users: [{
      type: String,
      ref: 'User'
    }]
  },
  dislikes: {
    number: {
      type: Number,
      default: 0
    },
    users: [{
      type: String,
      ref: 'User'
    }]
  },
  topicId: {
    type: String,
    required: true,
    ref: 'Topic'
  }
}, { usePushEach: true });

const opinionModel = mongoose.model('Opinion', opinionSchema);

export default opinionModel;
