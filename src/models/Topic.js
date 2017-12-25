/**
 * Created by bolorundurowb on 1/7/17.
 */

import mongoose from 'mongoose';
import shortid from 'shortid';

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
  categories: [{
    type: String,
    ref: 'Category'
  }]
});

const topicModel = mongoose.model('Topic', topicSchema);

export default topicModel;
