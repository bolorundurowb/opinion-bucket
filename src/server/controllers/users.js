/**
 * Created by bolorundurowb on 1/11/17.
 */

const Users = require('./../models/user');

const usersCtrl = {
  getAll: function (req, res) {
    Users.find(function (err, users) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(users);
      }
    });
  },

  getOne: function (req, res) {
    Users.findOne({_id: req.params.id}, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({message: 'No user exists with that id'});
      } else {
        res.status(200).send(user);
      }
    });
  },

  getOneFull: function (req, res) {
    Users.findOne({_id: req.params.id}, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(400).send({message: 'No user exists with that id'});
      } else {
        res.status(200).send(user);
      }
    });
  },

  update: function (req, res) {
    Users.findById(req.params.id, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (!(req.body.username && req.body.password && req.body.email && req.body)) {
        res.status(400).send({message: 'The user details are not complete'});
      } else {
        user = req.body;
        user.save(function (err, _user) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send(_user);
          }
        });
      }
    });
  },

  delete: function (req, res) {
    Users.findByIdAndRemove(req.params.id, function (err) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send({message: 'User successfully removed'});
      }
    });
  }
};

module.exports = usersCtrl;
