/**
 * Created by bolorundurowb on 1/11/17.
 */

import multer from 'multer';
import auth from '../controllers/Auth';
import Authentication from '../middleware/Authentication';

const upload = multer({ dest: 'uploads/' });

const authRoutes = (router) => {
  router.route('/signin')
    .post(auth.signin);

  router.route('/signup')
    .post(upload.single('profile'), auth.signup);

  router.route('/signout')
    .post(Authentication.isAuthenticated, auth.signout);
};

export default authRoutes;
