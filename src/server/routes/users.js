/**
 * Created by bolorundurowb on 1/11/17.
 */

import multer from 'multer';
import users from './../controllers/users';
import authentication from './../middleware/authentication';
import authorization from './../middleware/authorization';

const upload = multer({ dest: 'uploads/' });

const userRoutes = function (router) {
  router.route('/users')
    .get(authentication, authorization.isAdmin, users.getAll);

  router.route('/users/:id')
    .get(authentication, users.getOne)
    .put(authentication, upload.single('profile'), users.update)
    .delete(authentication, users.delete);

  router.route('/users/:id/full')
    .get(authentication, users.getOneFull);
};

export default userRoutes;
