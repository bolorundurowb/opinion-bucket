/**
 * Created by bolorundurowb on 1/11/17.
 */

import categories from '../controllers/Categories';
import authentication from './../middleware/authentication';
import authorization from './../middleware/authorization';

const categoryRoutes = function (router) {
  router.route('/categories')
    .get(categories.getAll)
    .post(authentication, authorization.isModerator, categories.create);

  router.route('/categories/:id')
    .get(categories.getOne)
    .put(authentication, authorization.isModerator, categories.update)
    .delete(authentication, authorization.isAdmin, categories.delete);
};

export default categoryRoutes;
