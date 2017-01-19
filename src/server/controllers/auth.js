/**
 * Created by bolorundurowb on 1/11/17.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./../models/user');

const authCtrl = {
  signin: function (req, res) {

  },
  
  signup: function (req, res) {
    if (!(req.body.email && req.body.username && req.body.password)) {
      res.status(400).send({message: 'A user must have an email address, username and password defined'});
    } else {
      const user = new Users(req.body);
      user.save(function (err, _user) {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(tokenify(_user));
        }
      });
    }
  },

  signout: function (req, res) {
    res.status(200).send({message: 'signout successful'});
  }
};

function tokenify(user) {
  return user;
}

module.exports = authCtrl;
