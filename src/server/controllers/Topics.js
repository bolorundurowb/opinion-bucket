import Logger from '../config/Logger';
import Topic from '../models/Topic';

/**
 * Handles topics
 */
class Topics {
  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static getAll(req, res) {
    const filter = {};
    let limit = req.query.limit || 0;

    limit = parseInt(limit, 10);

    let skip = req.query.offset || 0;
    skip = parseInt(skip, 10);

    if (req.query.category) {
      filter.categories = {
        $in: [req.query.category]
      };
    }

    const sort = {};
    if (req.query.order) {
      if (req.query.order === 'date') {
        sort.date = -1;
      } else if (req.query.order === 'opinion') {
        sort.opinionsLength = -1;
      }
    }

    Topic.find(filter)
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .exec((err, topics) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when retrieving topics' });
        }
        res.status(200).send(topics);
      });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static getOne(req, res) {
    Topic.findOne({ _id: req.params.id }, (err, topic) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a topic' });
      } else if (!topic) {
        res.status(404).send({ message: 'No topic exists with that id' });
      } else {
        res.status(200).send(topic);
      }
    });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static getOneFull(req, res) {
    Topic
      .findOne({ _id: req.params.id })
      .populate('opinions categories')
      .exec((err, topic) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when retrieving a topic' });
        } else if (!topic) {
          res.status(404).send({ message: 'No topic exists with that id' });
        } else {
          res.status(200).send(topic);
        }
      });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static create(req, res) {
    Topic.findOne({ title: req.body.title }, (err, result) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a topic' });
      } else if (result) {
        res.status(409).send({ message: 'A topic exists with that title' });
      } else {
        const _topic = new Topic(req.body);
        _topic.save((err, topic) => {
          if (err) {
            Logger.error(err);
            res.status(500).send({ message: 'An error occurred when saving a topic' });
          }
          res.status(201).send(topic);
        });
      }
    });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static update(req, res) {
    const body = req.body;

    Topic.findById(req.params.id, (err, topic) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving a topic.' });
      } else if (!topic) {
        res.status(404).send({ message: 'A topic with that id doesn\'t exist.' });
      } else {
        ['title', 'content', 'categories'].forEach((property) => {
          if (body[property]) {
            topic[property] = body[property];
          }
        });

        topic.save((err, _topic) => {
          if (err) {
            Logger.error(err);
            res.status(500).send({ message: 'An error occurred when saving a topic.' });
          } else {
            res.status(200).send(_topic);
          }
        });
      }
    });
  }

  /**
   * Controller method to handle
   * @param {Object} req
   * @param {Object} res
   */
  static delete(req, res) {
    Topic.findByIdAndRemove(req.params.id, (err) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when removing a topic' });
      } else {
        res.status(200).send({ message: 'Topic successfully removed' });
      }
    });
  }
}

export default Topics;
