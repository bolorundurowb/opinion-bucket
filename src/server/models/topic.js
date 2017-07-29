/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  opinions: [{
    type: String,
    ref: 'Opinion'
  }],
  categories: [{
    type: String,
    ref: 'Category'
  }],
  opinionsLength: {
    type: Number,
    default: 0
  }
});

const topicModel = mongoose.model('Topic', topicSchema);

module.exports = topicModel;
