module.exports = app => {
  const {middlewares: {oauth, activityOauth, manager}, router, controller} = app;
  router.get('/manager/index.html', controller.backend.view.managerAdminView);
  router.get('/manager/logout', controller.backend.page.logout);
  router.post('/manager/user/login', manager(), controller.backend.user.login);
  router.get('/manager/user/list', manager(), controller.backend.user.list);
};
