/**
 * Created by bolorundurowb on 1/18/17.
 */

const Opinions = require('./../models/opinion');

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
    if (!(req.body.author && req.body.details)) {
      res.status(400).send({message: 'An opinion must have an author and content'});
    } else {
      const opinion = new Opinions(req.body);
      opinion.save(function (err, _opinion) {
        if (err) {
          res.status(500).send(err);
        }
        res.status(201).send(_opinion);
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
