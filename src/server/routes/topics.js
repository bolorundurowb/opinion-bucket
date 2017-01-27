/**
 * Created by bolorundurowb on 1/11/17.
 */

const topics = require('./../controllers/topics');
const authentication = require('./../middleware/authentication');

const topicRoutes = (router) => {
  router.route('/topics')
    .get(topics.getAll)
    .post(authentication, topics.create);

  router.route('/topics/:id')
    .get(topics.getOne)
    .put(authentication, topics.update)
    .delete(authentication, topics.delete);
};

module.exports = topicRoutes;
