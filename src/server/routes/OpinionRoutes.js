/**
 * Created by bolorundurowb on 1/18/17.
 */

import opinions from '../controllers/Opinions';
import Authentication from '../middleware/Authentication';

class OpinionRoutes {
  static route(router) {
    router.route('/opinions')
      .get(opinions.getAll)
      .post(Authentication.isAuthenticated, opinions.create);

    router.route('/opinions/:id')
      .get(opinions.getOne)
      .put(Authentication.isAuthenticated, opinions.update)
      .delete(Authentication.isAuthenticated, opinions.delete);

    router.route('/opinions/:id/like')
      .post(Authentication.isAuthenticated, opinions.like);

    router.route('/opinions/:id/dislike')
      .post(Authentication.isAuthenticated, opinions.dislike);
  }
}

export default OpinionRoutes;
