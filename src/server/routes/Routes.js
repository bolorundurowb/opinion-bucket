/**
 * Created by bolorundurowb on 1/6/17.
 */

import authRoutes from './AuthRoutes';
import userRoutes from './UserRoutes';
import categoryRoutes from './CategoryRoutes';
import topicRoutes from './TopicRoutes';
import opinionRoutes from './OpinionRoutes';

const routes = function (router) {
  authRoutes(router);
  categoryRoutes(router);
  opinionRoutes(router);
  topicRoutes(router);
  userRoutes(router);
};

export default routes;
