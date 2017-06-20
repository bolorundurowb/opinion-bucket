/**
 * Created by bolorundurowb on 1/11/17.
 */

const mongoose = require('mongoose');
const cloudinary = require('cloudinary');
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
    Users.findOne({_id: req.params.id})
      .populate('topics')
      .exec(function (err, user) {
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
      } else if (!user) {
        res.status(404).send({message: 'No user with that id'});
      } else{
        if (req.body.password) {
          user.password = req.body.password;
        }
        if (req.body.firstName) {
          user.firstName = req.body.firstName;
        }
        if (req.body.lastName) {
          user.lastName = req.body.lastName;
        }
        if (req.body.gender) {
          user.gender = req.body.gender;
        }
        if (req.body.dateOfBirth) {
          user.dateOfBirth = new Date(req.body.dateOfBirth);
        }
        if (req.body.topics) {
          user.topics = [];
          req.body.topics.forEach(function (topic_id) {
            try {
              var id = mongoose.Types.ObjectId(topic_id);
              user.topics.push(id);
            } catch (err) {}
          });
        }
        if (req.body.email) {
          user.email = req.body.email;
        }

        if (req.file) {
          cloudinary.uploader.upload(req.file.path, function (result) {
            user.profilePhoto = result.url;
            saveUser(user, res);
          });
        } else {
          saveUser(user, res);
        }
      }
    });
  },

  delete: function (req, res) {
    Users.findById(req.params.id, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (user.username === 'admin') {
        res.status(403).send({message: 'Admin cannot be removed'});
      } else {
        Users.findByIdAndRemove(req.params.id, function (err) {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).send({message: 'User successfully removed'});
          }
        });
      }
    });
  }
};

function saveUser(user, res) {
  user.save(function (err, _user) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(_user);
    }
  });
}

module.exports = usersCtrl;
