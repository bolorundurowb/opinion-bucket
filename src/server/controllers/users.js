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
    const body = req.body;
    
    Users.findById(req.params.id, function (err, user) {
      if (err) {
        res.status(500).send(err);
      } else if (!user) {
        res.status(404).send({message: 'No user with that id'});
      } else{
        ['firstName', 'lastName', 'gender', 'dateOfBirth', 'email'].forEach(function (property) { 
          if (body[property]) {
            user[property] = body[property];
          }
        });
        
        if (body.topics) {
          user.topics = [];
          req.body.topics.forEach(function (topic_id) {
            try {
              var id = mongoose.Types.ObjectId(topic_id);
              user.topics.push(id);
            } catch (err) {}
          });
        }

        if (req.file) {
          uploadImage(req.file, user)
            .then(function (url) {
              user.profilePhoto = url;
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

/**
 * Saves a user to the database
 * @param {Object} user
 * @param {Object} res
 */
function saveUser(user, res) {
  user.save(function (err, _user) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(_user);
    }
  });
}

/**
 * Uploads an image to cloudinary
 * @param {Object} file
 * @param {Object} user
 * @return {Promise<Object>}
 */
function uploadImage(file, user) {
  return new Promise(function (resolve) {
    cloudinary.uploader.upload(file.path, function (result) {
      resolve(result.url);
    });
  });
}

module.exports = usersCtrl;
