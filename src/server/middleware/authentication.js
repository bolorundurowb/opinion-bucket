/**
 * Created by bolorundurowb on 1/24/17.
 */

const auth = function (req, res, next) {
  const token = req.headers['x-access-token'] || req.body.token;
  if (token) {

  }
};

module.exports = auth;