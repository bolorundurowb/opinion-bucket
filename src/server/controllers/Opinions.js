/**
 * Created by bolorundurowb on 1/18/17.
 */

import Logger from '../config/Logger';
import Opinion from '../models/Opinion';
import Topics from '../models/Topic';

class Opinions {
  /**
   * Controller method to handle retrieving a bunch of opinions
   * @param {Object} req
   * @param {Object} res
   */
  static getAll(req, res) {
    const filter = {};
    let limit = req.query.limit || 0;
    limit = parseInt(limit, 10);

    let skip = req.query.offset || 0;
    skip = parseInt(skip, 10);

    if (req.params.topic) {
      try {
        filter.topicId = req.params.topic;
      } catch (err) {}
    }

    const sort = {};
    if (req.query.order) {
      if (req.query.order === 'date') {
        sort.date = -1;
      } else if (req.query.order === 'likes') {
        sort.likes = -1;
      } else if (req.query.order === 'dislikes') {
        sort.dislikes = -1;
      }
    }

    if (req.query.author) {
      filter.author = req.query.author;
    }

    if (req.query.topic) {
      filter.topicId = req.query.topic;
    }

    Opinion.find(filter)
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .exec((err, opinions) => {
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when retrieving opinions' });
        } else {
          res.status(200).send(opinions);
        }
      });
  }

  /**
   * Controller method to handle retrieving one opinion
   * @param {Object} req
   * @param {Object} res
   */
  static getOne(req, res) {
    Opinion.findOne({ _id: req.params.id }, (err, opinion) => {
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving an opinion' });
      } else if (!opinion) {
        res.status(400).send({ message: 'No opinion exists with that id' });
      } else {
        res.status(200).send(opinion);
      }
    });
  }

  /**
   * Controller method to handle creating an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static create(req, res) {
    Topics.findById(req.body.topicId, (err, topic) => {
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving an opinion' });
      } else if (!topic) {
        res.status(404).send({ message: 'A topic with that id doesn\'t exist' });
      } else {
        const opinion = new Opinion(req.body);
        opinion.save((err, _opinion) => {
          if (err) {
            Logger.error(err);
            res.status(500).send({ message: 'An error occurred when saving an opinion.' });
          } else {
            res.status(201).send(_opinion);
          }
        });
      }
    });
  }

  /**
   * Controller method to handle updating an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static update(req, res) {
    const body = req.body;

    Opinion.findById(req.params.id, (err, opinion) => {
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404).send({ message: 'An opinion with that id doesn\'t exist.' });
      } else {
        ['title', 'content', 'showName', 'date'].forEach((property) => {
          if (body[property]) {
            opinion[property] = body[property];
          }
        });

        Opinions.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle deleting an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static delete(req, res) {
    Opinion
      .findOneAndRemove({
        _id: req.params.id,
        author: req.user._id
      })
      .exec((err) => {
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when removing an opinion' });
        } else {
          res.status(200).send({ message: 'Opinion successfully removed' });
        }
      });
  }

  /**
   * Controller method to handle liking an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static like(req, res) {
    Opinion.findById(req.params.id, (err, opinion) => {
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404).send({ message: 'An opinion with that id doesn\'t exist.' });
      } else {
        opinion.likes += 1;
        Opinions.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle dislikes for an opinion
   * @param {Object} req
   * @param {Object} res
   */
  static dislike(req, res) {
    Opinion.findById(req.params.id, (err, opinion) => {
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving an opinion.' });
      } else if (!opinion) {
        res.status(404).send({ message: 'An opinion with that id doesn\'t exist.' });
      } else {
        opinion.dislikes += 1;
        Opinions.saveOpinion(opinion, res);
      }
    });
  }

  /**
   * Controller method to handle saving opinions
   * @param {Object} opinion
   * @param {Object} res
   */
  static saveOpinion(opinion, res) {
    opinion.save((err, _opinion) => {
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when saving an opinion' });
      } else {
        res.status(200).send(_opinion);
      }
    });
  }
}


export default Opinions;
