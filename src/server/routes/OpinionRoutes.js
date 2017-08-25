import opinions from '../controllers/Opinions';
import Authentication from '../middleware/Authentication';
import Validations from './../middleware/Validations';

/**
 * Holds all opinion routing logic
 */
class OpinionRoutes {
  /**
   * Route handling method
   * @param {Object} router
   */
  static route(router) {
    router.route('/opinions')
      .get(
        opinions.getAll
      )
      .post(
        Authentication.isAuthenticated,
        Validations.validateCreateOpinion,
        opinions.create
      );

    router.route('/opinions/:id')
      .get(
        opinions.getOne
      )
      .put(
        Authentication.isAuthenticated,
        opinions.update
      )
      .delete(
        Authentication.isAuthenticated,
        opinions.delete
      );

    router.route('/opinions/:id/like')
      .post(
        Authentication.isAuthenticated,
        opinions.like
      );

    router.route('/opinions/:id/dislike')
      .post(
        Authentication.isAuthenticated,
        opinions.dislike
      );
  }
}

export default OpinionRoutes;
