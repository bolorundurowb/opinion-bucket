/**
 * Created by winner-timothybolorunduro on 07/08/2017.
 */

/**
 * Holds all validation logic
 */
class Validations {
  /**
   * Handles signup validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateSignUp(req, res, next) {
    const body = req.body;

    if (!body.username) {
      res.status(400).send({ message: 'A username is required.' });
    } else if (!body.email) {
      res.status(400).send({ message: 'An email address is required.' });
    } else if (!body.password) {
      res.status(400).send({ message: 'A password is required.' });
    } else if (body.password.length < 6) {
      res.status(400).send({ message: 'A password must be six characters or greater.' });
    } else {
      next();
    }
  }

  /**
   * Handles signup validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateSignIn(req, res, next) {
    const body = req.body;

    if (!body.username && !body.email) {
      res.status(400).send({ message: 'A username or email is required.' });
    } else if (!body.password) {
      res.status(400).send({ message: 'A password is required.' });
    } else if (body.password.length < 6) {
      res.status(400).send({ message: 'A password must be six characters or greater.' });
    } else {
      next();
    }
  }
}

export default Validations;
