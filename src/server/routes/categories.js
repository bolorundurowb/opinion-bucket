/**
 * Created by bolorundurowb on 1/11/17.
 */

const categories = require('./../controllers/categories');
const authentication = require('./../middleware/authentication');

const categoryRoutes = (router) => {
  router.route('/categories')
    .get(categories.getAll)
    .post(authentication, categories.create);

  router.route('/categories/:id')
    .get(categories.getOne)
    .put(authentication, categories.update)
    .delete(authentication, categories.delete);
};

module.exports = categoryRoutes;
