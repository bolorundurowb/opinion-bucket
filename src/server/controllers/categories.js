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
        res.status(500).send(err);
      }
      res.status(200).send(categories);
    });
  },

  getOne: function (req, res) {
    Categories.find({_id: req.params.id}, function (err, category) {
      if (err) {
        res.status(500).send(err);
      } else if (!category) {
        res.status(400).send({message: 'No category exists with that id'});
      }
      res.status(200).send(category);
    });
  },

  create: function (req, res) {
    if (!req.body.title) {
      res.status(400).send({message: 'The category requires a title'});
    } else {
      Categories.findOne({title: req.body.title}, function (err, result) {
        if (err) {
          res.status(500).send(err);
        } else if (result) {
          res.status(409).send({message: 'A category exists with that title'});
        } else {
          const _category = new Categories(req.body);
          _category.save(function (err, category) {
            if (err) {
              res.status(500).send(err);
            }
            res.status(201).send(category);
          });
        }
      });
    }
  },

  update: function (req, res) {
    Categories.findById(req.params.id, function (err, category) {
      if (err) {
        res.status(500).send(err);
      } else if (!req.body.title) {
        res.status(400).send({message: 'The category requires a title'});
      }
      category.title = req.body.title;
      category.save(function (err, _category) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(_category);
      });
    });
  },

  delete: function (req, res) {
    Categories.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).send(err);
      }
      res.status(200).send({message: 'Category successfully removed'});
    });
  }
};

module.exports = categoriesCtrl;
