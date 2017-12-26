import Topics from '../controllers/Topics';
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
        Topics.getAll
      )
      .post(
        Authentication.isAuthenticated,
        Validations.validateCreateTopic,
        Topics.create
      );

    router.route('/topics/:tid')
      .get(
        Topics.getOne
      )
      .put(
        Authentication.isAuthenticated,
        Topics.update
      )
      .delete(
        Authentication.isAuthenticated,
        Authorization.isModerator,
        Topics.delete
      );

    router.route('/topics/:tid/opinions')
      .get(
        Authentication.ifIsAuthenticated,
        Topics.getOpinions
      )
      .post(
        Authentication.isAuthenticated,
        Validations.validateCreateOpinion,
        Topics.createOpinion
      );

    router.route('/topics/:tid/opinions/:oid')
      .get(
        Authentication.ifIsAuthenticated,
        Topics.getOpinion
      )
      .put(
        Authentication.isAuthenticated,
        Topics.updateOpinion
      )
      .delete(
        Authentication.isAuthenticated,
        Topics.removeOpinion
      );

    router.route('/topics/:tid/opinions/:oid/like')
      .put(
        Authentication.isAuthenticated,
        Topics.likeOpinion
      )
      .delete(
        Authentication.isAuthenticated,
        Topics.unlikeOpinion
      );

    router.route('/topics/:tid/opinions/:oid/dislike')
      .put(
        Authentication.isAuthenticated,
        Topics.dislikeOpinion
      )
      .delete(
        Authentication.isAuthenticated,
        Topics.undislikeOpinion
      );
  }
}

export default TopicRoutes;
