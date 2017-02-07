/**
 * Created by bolorundurowb on 1/11/17.
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Users = require('./../models/user');
const config = require('./../../../config/config');

const authCtrl = {
  signin: function (req, res) {
    if (!(req.body.username && req.body.password)) {
      res.status(400).send({message: 'A username or email and password are required'});
    } else {
      Users.findOne({$or: [{username: req.body.username}, {email: req.body.username}]}).exec(function (err, user) {
        if (err) {
          res.status(500).send(err);
        } else if (!user) {
          res.status(404).send({message: 'A user with that username or email does not exist'});
        } else {
          if (verifyPassword(req.body.password, user.hashedPassword)) {
            res.status(200).send(tokenify(user));
          } else {
            res.status(403).send({message: 'The passwords did not match'});
          }
        }
      });
    }
  },
  
  signup: function (req, res) {
    if (!(req.body.email && req.body.username && req.body.password)) {
      res.status(400).send({message: 'A user must have an email address, username and password defined'});
    } else {
      Users.find({$or: [{username: req.body.username}, {email: req.body.email}]}, function (err, result) {
        if (err) {
          res.status(500).send(err);
        } else if (result.length != 0) {
          res.status(409).send({message: 'A user exists with that username or email address'});
        } else {
          const user = new Users(req.body);
          user.joined = new Date();
          user.save(function (err, _user) {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(201).send(tokenify(_user));
            }
          });
        }
      });
    }
  },

  signout: function (req, res) {
    res.status(200).send({message: 'signout successful'});
  }
};

function tokenify(user) {
  var response = {user: user};
  response.token = jwt.sign(user._doc, config.secret, {
    expiresIn: '72h'
  });
  return response;
}

function verifyPassword(plainText, hashedPassword) {
  if (!(plainText && hashedPassword)) {
    return false;
  }
  return bcrypt.compareSync(plainText, hashedPassword);
}

module.exports = authCtrl;
