/**
 * Created by bolorundurowb on 1/11/17.
 */

const multer = require('multer');
const users = require('./../controllers/users');
const authentication = require('./../middleware/authentication');
const authorization = require('./../middleware/authorization');

const upload = multer({ dest: 'uploads/' });

const userRoutes = function (router) {
  router.route('/users')
    .get(authentication, authorization, users.getAll);

  router.route('/users/:id')
    .get(authentication, users.getOne)
    .put(authentication, upload.single('profile'), users.update)
    .delete(authentication, users.delete);

  router.route('/users/:id/full')
    .get(authentication, users.getOneFull);
};

module.exports = userRoutes;
