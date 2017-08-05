/**
 * Created by winner-timothybolorunduro on 15/07/2017.
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roleSchema = new Schema({
  _id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    unique: true,
    uppercase: true,
    required: true
  }
});

const roleModel = mongoose.model('Role', roleSchema);

export default roleModel;
