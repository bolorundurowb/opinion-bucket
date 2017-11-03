import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import config from '../config/Config';
import Logger from '../config/Logger';
import User from '../models/User';
import ImageHandler from '../util/ImageHandler';
import EmailTemplates from '../config/notification-templates/EmailTemplates';
import Email from '../config/Email';


/**
 * Authentication Controller
 */
class Auth {
  /**
   * Controller method for handling sign in requests
   * @param {Object} req
   * @param {Object} res
   */
  static signIn(req, res) {
    User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }] })
      .exec((err, user) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when retrieving users' });
        } else if (!user) {
          res.status(404).send({ message: 'A user with that username or email does not exist' });
        } else if (Auth.verifyPassword(req.body.password, user.hashedPassword)) {
          res.status(200).send({
            user,
            token: Auth.tokenify(user)
          });
        } else {
          res.status(403).send({ message: 'The passwords did not match' });
        }
      });
  }

  /**
   * Controller method for handling sign up requests
   * @param {Object} req
   * @param {Object} res
   */
  static signUp(req, res) {
    const body = req.body;

    User.find({ $or: [
        { username: body.username },
        { email: body.email }
    ] }, (err, result) => {
      /* istanbul ignore if */
      if (err) {
        Logger.error(err);
        res.status(500).send({ message: 'An error occurred when retrieving users' });
      } else if (result.length !== 0) {
        res.status(409).send({ message: 'A user exists with that username or email address' });
      } else {
        const user = new User(body);
        ImageHandler.uploadImage(req.file)
          .then((url) => {
            user.profilePhoto = url;
            user.save((err, _user) => {
              /* istanbul ignore if */
              if (err) {
                Logger.error(err);
                res.status(500).send({ message: 'An error occurred when saving users' });
              } else {
                res.status(201).send({
                  user: _user,
                  token: Auth.tokenify(_user)
                });

                const payload = EmailTemplates.getSignUpMail(user.email);
                Email.send(payload);
              }
            });
          });
      }
    });
  }

  /**
   * Controller method for handling sign out requests
   * @param {Object} req
   * @param {Object} res
   */
  static signOut(req, res) {
    res.status(200).send({ message: 'sign out successful' });
  }

  /**
   * Controller method for handling forgot password requests
   * @param {Object} req
   * @param {Object} res
   */
  static forgotPassword(req, res) {
    const body = req.body;

    User
      .findOne({ $or: [{ username: body.data }, { email: body.data }] })
      .exec((err, user) => {
        /* istanbul ignore if */
        if (err) {
          Logger.error(err);
          res.status(500).send({ message: 'An error occurred when checking for the user.' });
        } else if (!user) {
          res.status(404).send({ message: 'A user with that username or email doesn\'t exist.' });
        } else {
          res.status(200).send({ message: 'A password recovery email has been sent.' });
        }
      });
  }

  /**
   * Generate a JWT token
   * @param {Object} user
   * @return {String} - an object with the user and token
   */
  static tokenify(user) {
    return jwt.sign({ uid: user._id }, config.secret, {
      expiresIn: '48h'
    });
  }

  /**
   * Check if a password is correct
   * @param {String} plainText
   * @param {String} hashedPassword
   * @returns {Boolean} true | false - stating whether or not the passwords match
   */
  static verifyPassword(plainText, hashedPassword) {
    if (!(plainText && hashedPassword)) {
      return false;
    }

    return bcrypt.compareSync(plainText, hashedPassword);
  }
}

export default Auth;
