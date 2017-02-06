/**
 * Created by bolorundurowb on 1/11/17.
 */

const mongoose = require('mongoose');
const Topics = require('./../models/topic');

const topicsCtrl = {
  getAll: function (req, res) {
    var limit = req.query.limit || 0;
    limit = parseInt(limit);

    var skip = req.query.offset || 0;
    skip = parseInt(skip);

    var filter = {};
    if (req.query.category) {
      try {
        filter.categories = {
          '$in': [mongoose.Types.ObjectId(req.query.category)]
        };
      } catch (err) {
        console.log('The mongo id supplied is invalid');
      }
    }

    var sort = {};
    if (req.query.order) {
      if (req.query.order === 'date') {
        sort.date = -1;
      } else if (req.query.order === 'opinion') {
        sort.opinionsLength = -1;
      }
    }

    Topics.find(filter)
      .limit(limit)
      .sort(sort)
      .skip(skip)
      .exec(function (err, topics) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(topics);
      });
  },

  getOne: function (req, res) {
    Topics.findOne({_id: req.params.id}, function (err, topic) {
      if (err) {
        res.status(500).send(err);
      } else if (!topic) {
        res.status(400).send({message: 'No topic exists with that id'});
      } else {
        res.status(200).send(topic);
      }
    });
  },

  getOneFull: function (req, res) {
    Topics.findOne({_id: req.params.id})
      .populate('opinions categories')
      .exec(function (err, topic) {
        if (err) {
          res.status(500).send(err);
        } else if (!topic) {
          res.status(400).send({message: 'No topic exists with that id'});
        } else {
          res.status(200).send(topic);
        }
      });
  },

  create: function (req, res) {
    if (!req.body.title) {
      res.status(400).send({message: 'The topic requires a title'});
    } else {
      Topics.findOne({title: req.body.title}, function (err, result) {
        if (err) {
          res.status(500).send(err);
        } else if (result) {
          res.status(409).send({message: 'A topic exists with that title'});
        } else {
          const _topic = new Topics(req.body);
          _topic.save(function (err, topic) {
            if (err) {
              res.status(500).send(err);
            }
            res.status(201).send(topic);
          });
        }
      });
    }
  },

  update: function (req, res) {
    Topics.findById(req.params.id, function (err, topic) {
      if (err) {
        res.status(500).send(err);
      } else if (!topic) {
        res.status(404).send({message: 'A topic with that id doesn\'t exist'});
      } else {
        if (req.body.content) {
          topic.content = req.body.content;
        }
        if (req.body.date) {
          topic.date = new Date(req.body.date);
        }
        if (req.body.categories) {
          if (Array.isArray(req.body.categories)) {
            req.body.categories.forEach(function (cat_id) {
              if (typeof cat_id == 'string') {
                var id = mongoose.Types.ObjectId(cat_id);
                topic.categories.push(id);
              } else {
                topic.categories.push(cat_id);
              }
            });
          } else {
            var id = mongoose.Types.ObjectId(req.body.categories);
            topic.categories.push(id);
          }
        }
        topic.categories = Array.from(new Set(topic.categories));
        topic.save(function (err, _topic) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(_topic);
          }
        });
      }
    });
  },

  delete: function (req, res) {
    Topics.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({message: 'Topic successfully removed'});
      }
    });
  }
};

module.exports = topicsCtrl;
