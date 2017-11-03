/**
 * Created by bolorundurowb on 1/11/17.
 */

import multer from 'multer';
import Auth from '../controllers/Auth';
import Authentication from '../middleware/Authentication';
import Validations from '../middleware/Validations';

const upload = multer({ dest: 'uploads/' });

/**
 * Handles all authentication routing logic
 */
class AuthRoutes {
  /**
   * Route handling method
   * @param {Object} router
   */
  static route(router) {
    router.route('/signIn')
      .post(Validations.validateSignIn, Auth.signIn);

    router.route('/signUp')
      .post(upload.single('profile'), Validations.validateSignUp, Auth.signUp);

    router.route('/signOut')
      .post(Authentication.isAuthenticated, Auth.signOut);

    router.route('/forgotPassword')
      .post(Validations.validateForgotPassword, Auth.forgotPassword);
  }
}

export default AuthRoutes;
