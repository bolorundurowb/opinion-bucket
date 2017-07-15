/**
 * Created by bolorundurowb on 1/24/17.
 */

const auth = function (req, res, next) {
  if (req.user.role.name === 'ADMIN') {
    next();
  } else {
    res.status(403).send({message: 'You need to be an admin to access that information'});
  }
};

module.exports = auth;
