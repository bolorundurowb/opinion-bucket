/**
 * Created by bolorundurowb on 1/11/17.
 */

import auth from '../controllers/Auth';
import multer from 'multer';
import authentication from './../middleware/authentication';

const upload = multer({ dest: 'uploads/' });

const authRoutes = function (router) {
  router.route('/signin')
    .post(auth.signin);

  router.route('/signup')
    .post(upload.single('profile'), auth.signup);

  router.route('/signout')
    .post(authentication, auth.signout);
};

export default authRoutes;
