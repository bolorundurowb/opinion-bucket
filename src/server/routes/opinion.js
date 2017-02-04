/**
 * Created by bolorundurowb on 1/18/17.
 */

const opinions = require('./../controllers/opinions');
const authentication = require('./../middleware/authentication');

const opinionRoutes = function (router) {
  router.route('/opinions')
    .get(opinions.getAll)
    .post(authentication, opinions.create);

  router.route('/opinions/:id')
    .get(opinions.getOne)
    .put(authentication, opinions.update)
    .delete(authentication, opinions.delete);

  router.route('/opinions/:id/like')
    .post(authentication, opinions.like);

  router.route('/opinions/:id/dislike')
    .post(authentication, opinions.dislike);
};

module.exports = opinionRoutes;
