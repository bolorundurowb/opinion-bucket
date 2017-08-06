/**
 * Created by bolorundurowb on 1/11/17.
 */

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import cloudinary from 'cloudinary';
import config from '../config/config';
import logger from '../config/Logger';
import Users from './../models/user';


const authCtrl = {
  signin: function (req, res) {
    if (!(req.body.username && req.body.password)) {
      res.status(400).send({message: 'A username or email and password are required'});
    } else {
      Users.findOne({$or: [{username: req.body.username}, {email: req.body.username}]}).exec((err, user) => {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving users'});
        } else if (!user) {
          res.status(404).send({message: 'A user with that username or email does not exist'});
        } else {
          if (verifyPassword(req.body.password, user.hashedPassword)) {
            res.status(200).send({
              user: user,
              token: tokenify(user)
            });
          } else {
            res.status(403).send({message: 'The passwords did not match'});
          }
        }
      });
    }
  },
  
  signup: function (req, res) {
    const body = req.body;
    if (!body.email) {
      res.status(400).send({message: 'A user must have an email address.'});
    } else if (!body.username) {
      res.status(400).send({message: 'A user must have a username.'});
    } else if (!body.password) {
      res.status(400).send({message: 'A user must have a password.'});
    } else {
      Users.find({$or: [{username: req.body.username}, {email: req.body.email}]}, (err, result) => {
        if (err) {
          logger.error(err);
          res.status(500).send({message: 'An error occurred when retrieving users'});
        } else if (result.length !== 0) {
          res.status(409).send({message: 'A user exists with that username or email address'});
        } else {
          const user = new Users(req.body);
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
    }
  },

  signout: function (req, res) {
    res.status(200).send({message: 'sign out successful'});
  }
};

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

/**
 * Saves a user to the database
 * @param {Object} user
 * @param {Object} res
 */
function saveUser(user, res) {
  user.save(function (err, _user) {
    if (err) {
      logger.error(err);
      res.status(500).send({message: 'An error occurred when saving users'});
    } else {
      res.status(201).send({
        user: user,
        token: tokenify(_user)
      });
    }
  });
}

/**
 * Generate a JWT token
 * @param {Object} user
 * @return {{user: *}} - an object with the user and token
 */
function tokenify(user) {
  return jwt.sign({uid: user._id}, config.secret, {
    expiresIn: '48h'
  });
}

function verifyPassword(plainText, hashedPassword) {
  if (!(plainText && hashedPassword)) {
    return false;
  }

  return bcrypt.compareSync(plainText, hashedPassword);
}

export default authCtrl;
