/**
 * Created by bolorundurowb on 1/11/17.
 */

const logger = require('./../config/logger');
const Categories = require('./../models/category');

const categoriesCtrl = {
  getAll: function (req, res) {
    Categories.find(function (err, categories) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving categories'});
      } else {
        res.status(200).send(categories);
      }
    });
  },

  getOne: function (req, res) {
    Categories.findOne({_id: req.params.id}, function (err, category) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a category'});
      } else if (!category) {
        res.status(400).send({message: 'No category exists with that id'});
      } else {
        res.status(200).send(category);
      }
    });
  },

  create: function (req, res) {
    if (!req.body.title) {
      res.status(400).send({message: 'The category requires a title'});
    } else {
      Categories.findOne({title: req.body.title}, function (err, result) {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving a category'});
        } else if (result) {
          res.status(409).send({message: 'A category exists with that title'});
        } else {
          const _category = new Categories(req.body);
          _category.save(function (err, category) {
            if (err) {
              logger.error(err);
              res.status(500).send({message: 'An error occurred when saving a category'});
            } else {
              res.status(201).send(category);
            }
          });
        }
      });
    }
  },

  update: function (req, res) {
    Categories.findById(req.params.id, function (err, category) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a category'});
      } else if (!req.body.title) {
        res.status(400).send({message: 'The category requires a title'});
      } else {
        category.title = req.body.title;
        category.save(function (err, _category) {
          if (err) {
            logger.error(err);
            res.status(500).send({message: 'An error occurred when saving a category'});
          } else {
            res.status(200).send(_category);
          }
        });
      }
    });
  },

  delete: function (req, res) {
    Categories.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when removing a category'});
      } else {
        res.status(200).send({message: 'Category successfully removed'});
      }
    });
  }
};

module.exports = categoriesCtrl;
