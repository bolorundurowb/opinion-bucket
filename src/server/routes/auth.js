/**
 * Created by bolorundurowb on 1/11/17.
 */

const auth = require('./../controllers/auth');
const multer = require('multer');
const authentication = require('./../middleware/authentication');

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
