/**
 * Created by bolorundurowb on 1/7/17.
 */

import mongoose from 'mongoose';
import shortid from 'shortid';

const Schema = mongoose.Schema;

const categorySchema = new Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  title: {
    type: String
  }
});

const categoryModel = mongoose.model('Category', categorySchema);

export default categoryModel;
