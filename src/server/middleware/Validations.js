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

  /**
   * Handles category creation validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateCreateCategory(req, res, next) {
    const body = req.body;

    if (!body.title) {
      res.status(400).send({ message: 'The category requires a title' });
    } else {
      next();
    }
  }

  /**
   * Handles category update validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateUpdateCategory(req, res, next) {
    Validations.validateCreateCategory(req, res, next);
  }

  /**
   * Handles opinion creation validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateCreateOpinion(req, res, next) {
    const body = req.body;
    body.author = req.user._id;

    if (!body.author) {
      res.status(400).send({ message: 'An author is required.' });
    } else if (!body.title) {
      res.status(400).send({ message: 'A title is required.' });
    } else if (!body.topicId) {
      res.status(400).send({ message: 'A topic id is required.' });
    } else {
      next();
    }
  }
}

export default Validations;
