/**
 * Created by bolorundurowb on 1/11/17.
 */

const users = require('./../controllers/users');

const userRoutes = (router) => {
  router.route('/users')
    .get(users.getAll);

  router.route('/users/:id')
    .get(users.getOne)
    .put(users.update)
    .delete(users.delete);
};

module.exports = userRoutes;
