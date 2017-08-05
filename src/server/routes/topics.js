/**
 * Created by bolorundurowb on 1/11/17.
 */

import topics from './../controllers/topics';
import authentication from './../middleware/authentication';
import authorization from './../middleware/authorization';

const topicRoutes = function (router) {
  router.route('/topics')
    .get(topics.getAll)
    .post(authentication, topics.create);

  router.route('/topics/:id')
    .get(topics.getOne)
    .put(authentication, topics.update)
    .delete(authentication, authorization.isModerator, topics.delete);

  router.route('/topics/:id/full')
    .get(topics.getOneFull);
};

export default topicRoutes;
