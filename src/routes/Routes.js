import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';
import categoryRoutes from './CategoryRoutes';
import topicRoutes from './TopicRoutes';

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
    topicRoutes.route(router);
    userRoutes.route(router);
  }
}

export default Routes;
