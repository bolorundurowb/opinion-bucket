/**
 * Created by bolorundurowb on 1/11/17.
 */

const mongoose = require('mongoose');
const Categories = require('./../models/category');
const config = require('./../../../config/config');

// Connect to MongoDB
mongoose.connect(config.database);

const categoriesCtrl = {
  getAll: function (req, res) {
    Categories.find(function (err, categories) {
      if (err) {
        res.status(500).send({error: err});
      }
      res.status(200).send(categories);
    });
  },
  getOne: function (req, res) {
    Categories.find({_id: req.param.id}, function (err, category) {
      if (err) {
        res.status(500).send({error: err});
      }
      if (!category) {
        res.status(400).send({message: 'No category exists with that id'});
      }
      res.status(200).send(category);
    });
  },
  create: function (req, res) {

  },
  update: function (req, res) {

  },
  delete: function (req, res) {

  }
};

module.exports = categoriesCtrl;
