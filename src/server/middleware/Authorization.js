/**
 * Created by bolorundurowb on 1/24/17.
 */

/**
 * Holds all logic for authorization
 */
class Authorization {
  /**
   * Middleware method for checking if user is a moderator
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static isModerator(req, res, next) {
    // if a moderator can access a route then an admin can too
    if (req.user.role.name === 'MODERATOR' || req.user.role.name === 'ADMIN') {
      next();
    } else {
      res.status(403).send({ message: 'You need to be an admin or moderator to access that information' });
    }
  }

  /**
   * Middleware method for checking if user is an admin
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static isAdmin(req, res, next) {
    if (req.user.role.name === 'ADMIN') {
      next();
    } else {
      res.status(403).send({ message: 'You need to be an admin to access that information' });
    }
  }
}

export default Authorization;
