/**
 * Created by bolorundurowb on 1/11/17.
 */

import topics from '../controllers/Topics';
import Authentication from '../middleware/Authentication';
import authorization from '../middleware/Authorization';

const topicRoutes = (router) => {
  router.route('/topics')
    .get(topics.getAll)
    .post(Authentication.isAuthenticated, topics.create);

  router.route('/topics/:id')
    .get(topics.getOne)
    .put(Authentication.isAuthenticated, topics.update)
    .delete(Authentication.isAuthenticated, authorization.isModerator, topics.delete);

  router.route('/topics/:id/full')
    .get(topics.getOneFull);
};

export default topicRoutes;
