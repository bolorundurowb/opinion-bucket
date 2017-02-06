/**
 * Created by bolorundurowb on 1/6/17.
 */

const authRoutes = require('./auth');
const userRoutes = require('./users');
const categoryRoutes = require('./categories');
const topicRoutes = require('./topics');
const opinionRoutes = require('./opinion');

const routes = function (router) {
  authRoutes(router);
  categoryRoutes(router);
  opinionRoutes(router);
  topicRoutes(router);
  userRoutes(router);
};

module.exports = routes;
