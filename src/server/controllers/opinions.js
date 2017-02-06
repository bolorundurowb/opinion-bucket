/**
 * Created by bolorundurowb on 1/18/17.
 */

const Opinions = require('./../models/opinion');
const Topics = require('./../models/topic');
const Users = require('./../models/user');

const opinionsCtrl = {
  getAll: function (req, res) {
    Opinions.find(function (err, opinions) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(opinions);
      }
    });
  },

  getOne: function (req, res) {
    Opinions.findOne({_id: req.params.id}, function (err, opinion) {
      if (err) {
        res.status(500).send(err);
      } else if (!opinion) {
        res.status(400).send({message: 'No opinion exists with that id'});
      } else {
        res.status(200).send(opinion);
      }
    });
  },

  create: function (req, res) {
    req.body.author = req.user._id;
    if (!(req.body.author && req.body.content)) {
      res.status(400).send({message: 'An opinion must have an author and content'});
    } else if (!req.body.topicId) {
      res.status(400).send({message: 'An opinion must have a topic'});
    } else {
      Topics.findById(req.body.topicId, function (err, topic) {
        if (err) {
          res.status(500).send(err);
        } else if (!topic) {
          res.status(404).send({message: 'A topic with that id doesn\'t exist'});
        } else {
          const opinion = new Opinions(req.body);
          opinion.save(function (err, _opinion) {
            if (err) {
              res.status(500).send(err);
            } else {
              topic.opinions.push(_opinion._id);
              topic.opinionsLength++;
              topic.save(function (err, result) {
                if (err) {
                  console.log('Error updating topic with opinion', err, message);
                } else {
                  console.log('Successfully updated topic with opinion');
                }
              });
              Users.findById(req.user._id, function (err, user) {
                user.topics.push(topic._id);
                user.save(function (err, result) {
                  if (err) {
                    console.log('Error updating user with topic', err.message);
                  } else {
                    console.log('Successfully updated user with topic');
                  }
                });
              });
              res.status(201).send(_opinion);
            }
          });
        }
      });

    }
  },

  update: function (req, res) {
    Opinions.findById(req.params.id, function (err, opinion) {
      if (err) {
        res.status(500).send(err);
      } else if (!req.body.content) {
        res.status(400).send({message: 'The opinion must have content'});
      } else {
        opinion.content = req.body.content;
        opinion.save(function (err, _opinion) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(_opinion);
          }
        });
      }
    });
  },

  delete: function (req, res) {
    Opinions.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({message: 'Opinion successfully removed'});
      }
    });
  },

  like: function (req, res) {
    Opinions.findById(req.params.id, function (err, opinion) {
      if (err) {
        res.status(500).send(err);
      } else if (!req.body.content) {
        res.status(400).send({message: 'The opinion must have content'});
      } else {
        opinion.likes += 1;
        opinion.save(function (err, _opinion) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(_opinion);
          }
        });
      }
    });
  },

  dislike: function (req, res) {
    Opinions.findById(req.params.id, function (err, opinion) {
      if (err) {
        res.status(500).send(err);
      } else if (!req.body.content) {
        res.status(400).send({message: 'The opinion must have content'});
      } else {
        opinion.dislikes += 1;
        opinion.save(function (err, _opinion) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(_opinion);
          }
        });
      }
    });
  }
};

module.exports = opinionsCtrl;
