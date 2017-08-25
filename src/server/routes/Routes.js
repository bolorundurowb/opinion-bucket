import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';
import categoryRoutes from './CategoryRoutes';
import topicRoutes from './TopicRoutes';
import opinionRoutes from './OpinionRoutes';

/**
 * Holds all routing logic
 */
class Routes {
  /**
   * Route handling method
   * @param {Object} router
   */
  static route(router) {
    authRoutes.route(router);
    categoryRoutes.route(router);
    opinionRoutes.route(router);
    topicRoutes.route(router);
    userRoutes.route(router);
  }
}

export default Routes;
