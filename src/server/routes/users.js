/**
 * Created by bolorundurowb on 1/11/17.
 */

const users = require('./../controllers/users');
const authentication = require('./../middleware/authentication');

const userRoutes = (router) => {
  router.route('/users')
    .get(authentication, users.getAll);

  router.route('/users/:id')
    .get(authentication, users.getOne)
    .put(authentication, users.update)
    .delete(authentication, users.delete);
};

module.exports = userRoutes;
