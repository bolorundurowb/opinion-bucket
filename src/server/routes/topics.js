/**
 * Created by bolorundurowb on 1/11/17.
 */

const topics = require('./../controllers/topics');

const topicRoutes = (router) => {
  router.route('/topics')
    .get(topics.getAll)
    .post(topics.create);

  router.route('/topics/:id')
    .get(topics.getOne)
    .put(topics.update)
    .delete(topics.delete);
};

module.exports = topicRoutes;
