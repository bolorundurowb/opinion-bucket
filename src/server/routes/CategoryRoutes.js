/**
 * Created by bolorundurowb on 1/11/17.
 */

import categories from '../controllers/Categories';
import Authentication from '../middleware/Authentication';
import authorization from '../middleware/Authorization';

class CategoryRoutes {
  static route(router) {
    router.route('/categories')
      .get(categories.getAll)
      .post(Authentication.isAuthenticated, authorization.isModerator, categories.create);

    router.route('/categories/:id')
      .get(categories.getOne)
      .put(Authentication.isAuthenticated, authorization.isModerator, categories.update)
      .delete(Authentication.isAuthenticated, authorization.isAdmin, categories.delete);
  }
}

export default CategoryRoutes;
