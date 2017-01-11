/**
 * Created by bolorundurowb on 1/11/17.
 */

const auth = require('./../controllers/auth');

const authRoutes = (router) => {
  router.route('/auth/signin')
    .post(auth.signin);

  router.route('/auth/signup')
    .post(auth.signup);
};

module.exports = authRoutes;
