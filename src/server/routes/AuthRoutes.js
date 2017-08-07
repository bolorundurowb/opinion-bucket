/**
 * Created by bolorundurowb on 1/11/17.
 */

import multer from 'multer';
import Auth from '../controllers/Auth';
import Authentication from '../middleware/Authentication';
import Validations from './../middleware/Validations';

const upload = multer({ dest: 'uploads/' });

class AuthRoutes {
  static route(router) {
    router.route('/signin')
      .post(Validations.validateSignIn, Auth.signin);

    router.route('/signup')
      .post(upload.single('profile'), Validations.validateSignUp, Auth.signup);

    router.route('/signout')
      .post(Authentication.isAuthenticated, Auth.signout);
  }
}

export default AuthRoutes;
