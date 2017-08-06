/**
 * Created by bolorundurowb on 1/11/17.
 */

import logger from '../config/Logger';
import Category from './../models/category';

class Categories {
  static getAll(req, res) {
    Category.find(function (err, categories) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving categories'});
      } else {
        res.status(200).send(categories);
      }
    });
  }

static getOne(req, res) {
    Category.findOne({_id: req.params.id}, function (err, category) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a category'});
      } else if (!category) {
        res.status(400).send({message: 'No category exists with that id'});
      } else {
        res.status(200).send(category);
      }
    });
  }

static create(req, res) {
    if (!req.body.title) {
      res.status(400).send({message: 'The category requires a title'});
    } else {
      Category.findOne({title: req.body.title}, (err, result) => {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving a category'});
        } else if (result) {
          res.status(409).send({message: 'A category exists with that title'});
        } else {
          const _category = new Category(req.body);
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
  }

static update(req, res) {
    Category.findById(req.params.id, function (err, category) {
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
  }

static delete(req, res) {
    Category.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when removing a category'});
      } else {
        res.status(200).send({message: 'Category successfully removed'});
      }
    });
  }
}

export default Categories;