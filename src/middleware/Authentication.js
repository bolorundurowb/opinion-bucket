import jwt from 'jsonwebtoken';
import config from '../config/Config';
import logger from '../config/Logger';
import User from '../models/User';
// eslint-disable-next-line
import Role from '../models/Role';

/**
 * Holds all logic for authentication
 */
class Authentication {
  /**
   * Middleware method for checking user authentication
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static isAuthenticated(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers.token || req.body.token;

    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.status(401).send({ message: 'Failed to authenticate token.' });
        } else {
          User
            .findOne({ _id: decoded.uid })
            .populate('role')
            .exec((err, user) => {
              /* istanbul ignore if */
              if (err) {
                logger.error(err);
                res.status(500).send({ message: 'An error occurred when retrieving the user' });
              } else if (!user) {
                res.status(404).send({ message: 'A user with that token no longer exists.' });
              } else {
                req.user = user;

                next();
              }
            });
        }
      });
    } else {
      res.status(403).send({ message: 'You need to be logged in to access that information.' });
    }
  }

  /**
   * Middleware method for voluntary checking user authentication
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static ifIsAuthenticated(req, res, next) {
    const token = req.headers['x-access-token'] || req.headers.token || req.body.token;

    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (decoded) {
          User
            .findOne({ _id: decoded.uid })
            .populate('role')
            .exec((err, user) => {
              req.user = user;
              next();
            });
        } else {
          next();
        }
      });
    } else {
      next();
    }
  }
}

export default Authentication;
