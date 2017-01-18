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
    
  },

  update: function (req, res) {
    
  },

  delete: function (req, res) {
    
  }
};

module.exports = opinionsCtrl;