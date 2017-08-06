/**
 * Created by bolorundurowb on 1/11/17.
 */

import multer from 'multer';
import users from '../controllers/Users';
import Authentication from '../middleware/Authentication';
import authorization from '../middleware/Authorization';

const upload = multer({ dest: 'uploads/' });

class UserRoutes {
  static route(router) {
    router.route('/users')
      .get(Authentication.isAuthenticated, authorization.isAdmin, users.getAll);

    router.route('/users/:id')
      .get(Authentication.isAuthenticated, users.getOne)
      .put(Authentication.isAuthenticated, upload.single('profile'), users.update)
      .delete(Authentication.isAuthenticated, users.delete);

    router.route('/users/:id/full')
      .get(Authentication.isAuthenticated, users.getOneFull);
  }
}

export default UserRoutes;
