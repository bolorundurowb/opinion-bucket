/**
 * Created by bolorundurowb on 1/6/17.
 */

import authRoutes from './auth';
import userRoutes from './users';
import categoryRoutes from './categories';
import topicRoutes from './topics';
import opinionRoutes from './opinion';

const routes = function (router) {
  authRoutes(router);
  categoryRoutes(router);
  opinionRoutes(router);
  topicRoutes(router);
  userRoutes(router);
};

export default routes;
