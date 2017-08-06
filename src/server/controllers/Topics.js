/**
 * Created by bolorundurowb on 1/11/17.
 */

import mongoose from 'mongoose';
import logger from '../config/Logger';
import Topic from '../models/Topic';

class Topics {
  static getAll(req, res) {
    let limit = req.query.limit || 0;
    limit = parseInt(limit);

    let skip = req.query.offset || 0;
    skip = parseInt(skip);

    let filter = {};
    if (req.query.category) {
      try {
        filter.categories = {
          '$in': [mongoose.Types.ObjectId(req.query.category)]
        };
      } catch (err) {}
    }

    let sort = {};
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
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving topics'});
        }
        res.status(200).send(topics);
      });
  }

  static getOne(req, res) {
    Topic.findOne({_id: req.params.id}, (err, topic) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a topic'});
      } else if (!topic) {
        res.status(404).send({message: 'No topic exists with that id'});
      } else {
        res.status(200).send(topic);
      }
    });
  }

  static getOneFull(req, res) {
    Topic
      .findOne({_id: req.params.id})
      .populate('opinions categories')
      .exec((err, topic) => {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving a topic'});
        } else if (!topic) {
          res.status(404).send({message: 'No topic exists with that id'});
        } else {
          res.status(200).send(topic);
        }
      });
  }

  static create(req, res) {
    if (!req.body.title) {
      res.status(400).send({message: 'The topic requires a title'});
    } else {
      Topic.findOne({title: req.body.title}, (err, result) => {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving a topic'});
        } else if (result) {
          res.status(409).send({message: 'A topic exists with that title'});
        } else {
          const _topic = new Topic(req.body);
          _topic.save((err, topic) => {
            if (err) {
              logger.error(err);
              res.status(500).send({message: 'An error occurred when saving a topic'});
            }
            res.status(201).send(topic);
          });
        }
      });
    }
  }

  static update(req, res) {
    const body = req.body;

    Topic.findById(req.params.id, (err, topic) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a topic'});
      } else if (!topic) {
        res.status(404).send({message: 'A topic with that id doesn\'t exist'});
      } else {
        ['title', 'content'].forEach(function (property) {
          if (body[property]) {
            topic[property] = body[property];
          }
        });
        if (body.categories && Array.isArray(body.categories)) {
          topic.categories = [];
          req.body.categories.forEach(function (cat_id) {
            try {
              let id = mongoose.Types.ObjectId(cat_id);
              topic.categories.push(id);
            } catch (err) {}
          });
        }

        topic.save(function (err, _topic) {
          if (err) {
            logger.error(err);
            res.status(500).send({message: 'An error occurred when saving a topic'});
          } else {
            res.status(200).send(_topic);
          }
        });
      }
    });
  }

  static delete(req, res) {
    Topic.findByIdAndRemove(req.params.id, (err) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when removing a topic'});
      } else {
        res.status(200).send({message: 'Topic successfully removed'});
      }
    });
  }
}

export default Topics;
