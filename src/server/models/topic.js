/**
 * Created by bolorundurowb on 1/7/17.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const commentSchema = require('./comment');

const topicSchema = new Schema({
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
  opinions: [commentSchema],
  categories: [{
    type: Schema.ObjectId
  }]
});

const topicModel = mongoose.model('Topic', topicSchema);

module.exports = topicModel;
