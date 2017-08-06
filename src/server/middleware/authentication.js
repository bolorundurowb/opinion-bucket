/**
 * Created by bolorundurowb on 1/24/17.
 */

import jwt from 'jsonwebtoken';
import config from './../config/config';
import logger from './../config/logger';
import User from './../models/user';
// eslint-disable-next-line
import Role from './../models/role';

const auth = function (req, res, next) {
  const token = req.headers['x-access-token'] || req.headers['token'] || req.body.token;

  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.status(401).send({message: 'Failed to authenticate token.'});
      } else {
        User
          .findOne({ _id: decoded.uid })
          .populate('role')
          .exec((err, user) => {
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
    res.status(403).send({message: 'You need to be logged in to access that information.'});
  }
};

export default auth;
