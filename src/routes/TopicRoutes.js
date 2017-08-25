import topics from '../controllers/Topics';
import Authentication from '../middleware/Authentication';
import Authorization from '../middleware/Authorization';
import Validations from '../middleware/Validations';

/**
 * Holds all topic routing logic
 */
class TopicRoutes {
  /**
   * Route handling method
   * @param {Object} router
   */
  static route(router) {
    router.route('/topics')
      .get(
        topics.getAll
      )
      .post(
        Authentication.isAuthenticated,
        Validations.validateCreateTopic,
        topics.create
      );

    router.route('/topics/:id')
      .get(
        topics.getOne
      )
      .put(
        Authentication.isAuthenticated,
        topics.update
      )
      .delete(
        Authentication.isAuthenticated,
        Authorization.isModerator,
        topics.delete
      );

    router.route('/topics/:id/full')
      .get(
        topics.getOneFull
      );
  }
}

export default TopicRoutes;
