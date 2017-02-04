/**
 * Created by bolorundurowb on 1/24/17.
 */

const jwt = require('jsonwebtoken');
const config = require('./../../../config/config');

const auth = function (req, res, next) {
  const token = req.headers['x-access-token'] || req.body.token;
  if (token) {
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        res.status(401).send({message: 'Failed to authenticate token.'});
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(403).send({message: 'You need to be logged in to access that information.'});
  }
};

module.exports = auth;
