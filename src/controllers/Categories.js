import logger from '../config/Logger';
import Category from '../models/Category';

/**
 * Handles categories
 */
class Categories {
  /**
   * Controller method to handle retrieving all categories
   * @param {object} req
   * @param {object} res
   */
  static getAll(req, res) {
    Category.find((err, categories) => {
      /* istanbul ignore if */
      if (err) {
        logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving categories' });
      } else {
        res.status(200).send(categories);
      }
    });
  }

  /**
   * Controller method to handle retrieving  a category
   * @param {object} req
   * @param {object} res
   */
  static getOne(req, res) {
    Category.findOne({ _id: req.params.id }, (err, category) => {
      /* istanbul ignore if */
      if (err) {
        logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a category' });
      } else if (!category) {
        res.status(400).send({ message: 'No category exists with that id' });
      } else {
        res.status(200).send(category);
      }
    });
  }


  /**
   * Controller method to handle creating  a category
   * @param {object} req
   * @param {object} res
   */
  static create(req, res) {
    Category.findOne({ title: req.body.title }, (err, result) => {
      /* istanbul ignore if */
      if (err) {
        logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a category' });
      } else if (result) {
        res.status(409).send({ message: 'A category exists with that title' });
      } else {
        const _category = new Category(req.body);
        _category.save((err, category) => {
          /* istanbul ignore if */
          if (err) {
            logger.error(err);
            res.status(500).send({ message: 'An error occurred when saving a category' });
          } else {
            res.status(201).send(category);
          }
        });
      }
    });
  }


  /**
   * Controller method to handle updating  a category
   * @param {object} req
   * @param {object} res
   */
  static update(req, res) {
    Category.findById(req.params.id, (err, category) => {
      /* istanbul ignore if */
      if (err) {
        logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a category' });
      } else if (!category) {
        res.status(404).send({ message: 'A category with that id doesn\'t exist.' });
      } else {
        category.title = req.body.title;

        category.save((err, _category) => {
          /* istanbul ignore if */
          if (err) {
            logger.error(err);
            res.status(500).send({ message: 'An error occurred when saving a category' });
          } else {
            res.status(200).send(_category);
          }
        });
      }
    });
  }


  /**
   * Controller method to handle deleting  a category
   * @param {object} req
   * @param {object} res
   */
  static delete(req, res) {
    Category.findByIdAndRemove(req.params.id, (err) => {
      /* istanbul ignore if */
      if (err) {
        logger.error(err);
        res.status(500).send({ message: 'An error occurred when removing a category' });
      } else {
        res.status(200).send({ message: 'Category successfully removed' });
      }
    });
  }
}

export default Categories;
