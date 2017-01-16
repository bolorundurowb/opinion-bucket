/**
 * Created by bolorundurowb on 1/11/17.
 */

const Topics = require('./../models/topic');

const topicsCtrl = {
  getAll: function (req, res) {
    Topics.find(function (err, topics) {
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
      } else if (!req.body.title) {
        res.status(400).send({message: 'The topic requires a title'});
      } else {
        topic.title = req.body.title;
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
      }
      res.status(200).send({message: 'Topic successfully removed'});
    });
  }
};

module.exports = topicsCtrl;
