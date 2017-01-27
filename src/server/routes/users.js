/**
 * Created by bolorundurowb on 1/11/17.
 */

const users = require('./../controllers/users');
const authentication = require('./../middleware/authentication');
const authorization = require('./../middleware/authorization');

const userRoutes = function (router) {
  router.route('/users')
    .get(authentication, authorization, users.getAll);

  router.route('/users/:id')
    .get(authentication, users.getOne)
    .put(authentication, users.update)
    .delete(authentication, users.delete);
};

module.exports = userRoutes;
