/**
 * Created by bolorundurowb on 1/11/17.
 */

import categories from '../controllers/Categories';
import Authentication from '../middleware/Authentication';
import Authorization from '../middleware/Authorization';
import Validations from './../middleware/Validations';

class CategoryRoutes {
  /**
   * Route handling method
   * @param {Object} router
   */
  static route(router) {
    router.route('/categories')
      .get(
        categories.getAll
      )
      .post(
        Authentication.isAuthenticated,
        Authorization.isModerator,
        Validations.validateCreateCategory,
        categories.create
      );

    router.route('/categories/:id')
      .get(
        categories.getOne
      )
      .put(
        Authentication.isAuthenticated,
        Authorization.isModerator,
        Validations.validateUpdateCategory,
        categories.update
      )
      .delete(
        Authentication.isAuthenticated,
        Authorization.isAdmin,
        categories.delete
      );
  }
}

export default CategoryRoutes;
