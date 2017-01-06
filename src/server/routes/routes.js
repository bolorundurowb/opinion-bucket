const routes = (router) => {
  router.route('/')
    .get((req, res) => {
      res.send({message: 'hello'});
    });
};

export default routes;
