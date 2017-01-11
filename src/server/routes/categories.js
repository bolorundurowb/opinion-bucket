/**
 * Created by bolorundurowb on 1/11/17.
 */

const categories = require('./../controllers/categories');

const categoryRoutes = (router) => {
  router.route('/categories')
    .get(categories.getAll)
    .post(categories.create);

  router.route('/categories/:id')
    .get(categories.getOne)
    .put(categories.update)
    .delete(categories.delete);
};

module.exports = categoryRoutes;
