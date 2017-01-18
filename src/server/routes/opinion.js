/**
 * Created by bolorundurowb on 1/18/17.
 */

const opinions = require('./../controllers/opinions');

const opinionRoutes = (router) => {
  router.route('/opinions')
    .get(opinions.getAll)
    .post(opinions.create);

  router.route('/opinions/:id')
    .get(opinions.getOne)
    .put(opinions.update)
    .delete(opinions.delete);
};

module.exports = opinionRoutes;
