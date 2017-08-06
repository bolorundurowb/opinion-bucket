/**
 * Created by bolorundurowb on 1/24/17.
 */

class Authorization {
  static isModerator(req, res, next) {
    // if a moderator can access a route then an admin can too
    if (req.user.role.name === 'MODERATOR' || req.user.role.name === 'ADMIN') {
      next();
    } else {
      res.status(403).send({ message: 'You need to be an admin to access that information' });
    }
  }

  static isAdmin(req, res, next) {
    if (req.user.role.name === 'ADMIN') {
      next();
    } else {
      res.status(403).send({ message: 'You need to be an admin to access that information' });
    }
  }
}

export default Authorization;
