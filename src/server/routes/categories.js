/**
 * Created by bolorundurowb on 1/11/17.
 */

const categories = require('./../controllers/categories');
const authentication = require('./../middleware/authentication');
const authorization = require('./../middleware/authorization');

const categoryRoutes = function (router) {
  router.route('/categories')
    .get(categories.getAll)
    .post(authentication, authorization.isModerator, categories.create);

  router.route('/categories/:id')
    .get(categories.getOne)
    .put(authentication, authorization.isModerator, categories.update)
    .delete(authentication, authorization.isAdmin, categories.delete);
};

module.exports = categoryRoutes;
