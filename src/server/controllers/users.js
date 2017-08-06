/**
 * Created by bolorundurowb on 1/11/17.
 */

import mongoose from 'mongoose';
import cloudinary from 'cloudinary';
import logger from '../config/Logger';
import Users from './../models/user';

const usersCtrl = {
  getAll(req, res) {
    Users.find((err, users) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving users'});
      } else {
        res.status(200).send(users);
      }
    });
  },

  getOne(req, res) {
    Users.findOne({_id: req.params.id}, (err, user) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a user'});
      } else if (!user) {
        res.status(400).send({message: 'No user exists with that id'});
      } else {
        res.status(200).send(user);
      }
    });
  },

  getOneFull(req, res) {
    Users.findOne({_id: req.params.id})
      .populate('topics')
      .exec((err, user) => {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving a user'});
        } else if (!user) {
          res.status(400).send({message: 'No user exists with that id'});
        } else {
          res.status(200).send(user);
        }
      });
  },

  update(req, res) {
    const body = req.body;
    
    Users.findById(req.params.id, (err, user) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a user'});
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
              let id = mongoose.Types.ObjectId(topic_id);
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

  delete(req, res) {
    Users.findById(req.params.id, (err, user) => {
      if (err) {
        logger.error(err);
        res.status(500).send({message: 'An error occurred when retrieving a user'});
      } else if (user.username === 'admin') {
        res.status(403).send({message: 'Admin cannot be removed'});
      } else {
        Users.findByIdAndRemove(req.params.id, (err) => {
          if (err) {
            logger.error(err);
            res.status(500).send({message: 'An error occurred when removing a user'});
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
      logger.error(err);
      res.status(500).send({message: 'An error occurred when saving a user'});
    } else {
      res.status(200).send(_user);
    }
  });
}

/**
 * Uploads an image to cloudinary
 * @param {Object} file
 * @return {Promise<Object>}
 */
function uploadImage(file) {
  return new Promise(function (resolve) {
    cloudinary.uploader.upload(file.path, function (result) {
      resolve(result.url);
    });
  });
}

export default usersCtrl;
