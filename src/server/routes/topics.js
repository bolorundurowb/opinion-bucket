/**
 * Created by bolorundurowb on 1/11/17.
 */

const topics = require('./../controllers/topics');
const authentication = require('./../middleware/authentication');
const authorization = require('./../middleware/authorization');

const topicRoutes = function (router) {
  router.route('/topics')
    .get(topics.getAll)
    .post(authentication, authorization, topics.create);

  router.route('/topics/:id')
    .get(topics.getOne)
    .put(authentication, authorization, topics.update)
    .delete(authentication, authorization, topics.delete);
};

module.exports = topicRoutes;
