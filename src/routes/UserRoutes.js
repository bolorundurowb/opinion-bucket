import multer from 'multer';
import users from '../controllers/Users';
import Authentication from '../middleware/Authentication';
import authorization from '../middleware/Authorization';

const upload = multer({ dest: 'uploads/' });

/**
 * Holds all user routing logic
 */
class UserRoutes {
  /**
   * Route handling method
   * @param {Object} router
   */
  static route(router) {
    router.route('/users')
      .get(Authentication.isAuthenticated, authorization.isAdmin, users.getAll);

    router.route('/users/:id')
      .get(users.getOne)
      .put(Authentication.isAuthenticated, upload.single('profile'), users.update)
      .delete(Authentication.isAuthenticated, users.delete);

    router.route('/users/:id/full')
      .get(Authentication.isAuthenticated, users.getOneFull);
  }
}

export default UserRoutes;
