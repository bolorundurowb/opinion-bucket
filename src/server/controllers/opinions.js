/**
 * Created by bolorundurowb on 1/18/17.
 */

const mongoose = require('mongoose');
const logger = require('./../config/logger');
const Opinions = require('./../models/opinion');
const Topics = require('./../models/topic');
const Users = require('./../models/user');

const opinionsCtrl = {
  getAll: function (req, res) {
    var limit = req.query.limit || 0;
    limit = parseInt(limit);

    var skip = req.query.offset || 0;
    skip = parseInt(skip);

    var filter = {};
    if (req.params.topic) {
      try {
        filter.topicId = req.params.topic;
      } catch (err) {}
    }

    var sort = {};
    if (req.query.order) {
      if (req.query.order === 'date') {
        sort.date = -1;
      } else if (req.query.order === 'likes') {
        sort.likes = -1;
      } else if (req.query.order === 'dislikes') {
        sort.dislikes = -1;
      }
    }

    Opinions.find(filter)
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .exec(function (err, opinions) {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving opinions'});
        } else {
          res.status(200).send(opinions);
        }
      });
  },

  getOne: function (req, res) {
    Opinions.findOne({_id: req.params.id}, function (err, opinion) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving an opinion'});
      } else if (!opinion) {
        res.status(400).send({message: 'No opinion exists with that id'});
      } else {
        res.status(200).send(opinion);
      }
    });
  },

  create: function (req, res) {
    req.body.author = req.user._id;
    if (!(req.body.author && req.body.title)) {
      res.status(400).send({message: 'An opinion must have an author and title'});
    } else if (!req.body.topicId) {
      res.status(400).send({message: 'An opinion must have a parent topic'});
    } else {
      Topics.findById(req.body.topicId, function (err, topic) {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving an opinion'});
        } else if (!topic) {
          res.status(404).send({message: 'A topic with that id doesn\'t exist'});
        } else {
          const opinion = new Opinions(req.body);
          opinion.save(function (err, _opinion) {
            if (err) {
              logger.error(err);
              res.status(500).send({message: 'An error occurred when saving an opinion.'});
            } else {
              topic.opinions.push(_opinion._id);
              topic.opinionsLength++;
              topic.save();

              Users.findById(req.user._id, function (err, user) {
                user.topics.push(topic._id);
                user.save(function () {});
              });

              res.status(201).send(_opinion);
            }
          });
        }
      });
    }
  },

  update: function (req, res) {
    const body = req.body;

    Opinions.findById(req.params.id, function (err, opinion) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving an opinion'});
      } else {
        ['title', 'content', 'showName', 'date'].forEach(function (property) {
          if (body[property]) {
            opinion[property] = body[property];
          }
        });

        saveOpinion(opinion, res);
      }
    });
  },

  delete: function (req, res) {
    Opinions
      .findOneAndRemove({_id: req.params.id})
      .exec(function (err) {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when removing an opinion'});
        } else {
          res.status(200).send({message: 'Opinion successfully removed'});
        }
      });

    Topics.find({
      opinions: {
        '$in': [req.params.id]
      }
    }).exec(function (err, topics) {
      topics.forEach(function (topic) {
        var index = topic.opinions.indexOf(req.params.id);
        if (index !== -1) {
          topic.opinions.splice(index, 1);
          topic.opinionsLength = topic.opinions.length;
        }

        topic.save(function () {});

        Users.findById(req.user._id, function (err, user) {
          var index = user.topics.indexOf(topic._id);
          if (index !== -1) {
            user.topics.splice(index, 1);
          }

          user.save(function () {});
        });
      });
    });
  },

  like: function (req, res) {
    Opinions.findById(req.params.id, function (err, opinion) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving an opinion'});
      } else {
        opinion.likes += 1;
        saveOpinion(opinion, res);
      }
    });
  },

  dislike: function (req, res) {
    Opinions.findById(req.params.id, function (err, opinion) {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving an opinion'});
      } else {
        opinion.dislikes += 1;
        saveOpinion(opinion, res);
      }
    });
  }
};

function saveOpinion(opinion, res) {
  opinion.save(function (err, _opinion) {
    if (err) {
      logger.error(err);
      res.status(500).send({message: 'An error occurred when saving an opinion'});
    } else {
      res.status(200).send(_opinion);
    }
  });
}

module.exports = opinionsCtrl;
