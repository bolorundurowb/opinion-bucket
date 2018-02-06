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
    // insert the author data
    req.body.author = req.user._id;
    const body = req.body;

    if (!body.author) {
      res.status(400).send({ message: 'An author is required.' });
    } else if (!body.title) {
      res.status(400).send({ message: 'A title is required.' });
    } else {
      next();
    }
  }

  /**
   * Handles topic creation validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateCreateTopic(req, res, next) {
    // insert the author data
    req.body.author = req.user._id;
    const body = req.body;

    if (!body.author) {
      res.status(400).send({ message: 'An author is required.' });
    } else if (!body.title) {
      res.status(400).send({ message: 'A title is required.' });
    } else {
      next();
    }
  }

  /**
   * Handles forgot password validation logic
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateForgotPassword(req, res, next) {
    const body = req.body;

    if (!body.data) {
      res.status(400).send({ message: 'A username or email address is required.' });
    } else {
      next();
    }
  }

  /**
   * Validate if all fields necessary for resetting are filled in
   * @param {Object} req
   * @param {Object} res
   * @param {Function} next
   */
  static validateResetPassword(req, res, next) {
    const body = req.body;

    if (!body.token) {
      res.status(400).send({ message: 'A reset token is required.' });
    } else if (!body.password) {
      res.status(400).send({ message: 'A new password is required.' });
    } else {
      next();
    }
  }
}

export default Validations;
