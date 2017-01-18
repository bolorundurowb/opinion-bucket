/**
 * Created by bolorundurowb on 1/6/17.
 */

const authRoutes = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const topicRoutes = require('./topics');

const routes = (router) => {
  authRoutes(router);
  categoryRoutes(router);
  userRoutes(router);
  topicRoutes(router);
};

module.exports = routes;
