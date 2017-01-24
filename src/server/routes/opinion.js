/**
 * Created by bolorundurowb on 1/18/17.
 */

const opinions = require('./../controllers/opinions');

const opinionRoutes = function (router) {
  router.route('/opinions')
    .get(opinions.getAll)
    .post(opinions.create);

  router.route('/opinions/:id')
    .get(opinions.getOne)
    .put(opinions.update)
    .delete(opinions.delete);

  router.route('/opinions/:id/like')
    .post(opinions.like);

  router.route('/opinions/:id/dislike')
    .post(opinions.dislike);
};

module.exports = opinionRoutes;
