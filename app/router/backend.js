module.exports = app => {
  const {middlewares: {oauth, activityOauth}, router, controller} = app;
  router.redirect('/', '/index.html', 302);
  // router.redirect('/', '/index.html', 302);
  router.get('/index.html', controller.backend.view.adminView);
  router.redirect('/activity/', '/activity/index.html', 302);
  router.get('/activity/index.html', controller.backend.view.activityAdminView);

  /** *******************通用接口START*****************************/
  /**
   * 数据埋点
   */
  router.post('/admin/category/save', oauth(), activityOauth(), controller.backend.category.saveCategory);
  router.post('/admin/category/delete', oauth(), activityOauth(), controller.backend.category.deleteCategory);
  router.get('/admin/category/list', oauth(), activityOauth(), controller.backend.category.getCategoryList);

  router.get('/admin/route/get', oauth(), controller.backend.page.routeGet);

  router.get('/admin/top/getOnsaleList', oauth(), controller.backend.top.getOnsaleList);
  router.get('/admin/base/synchronizationTaobaoData', oauth(), activityOauth(), controller.backend.goods.synchronizationTaobaoData);

  /**
   * 后端配置资源
   */
  router.post('/admin/resource/save', oauth(), activityOauth(), controller.backend.resource.saveResource);
  router.get('/admin/resource/get', oauth(), activityOauth(), controller.backend.resource.getResource);

  router.post('/admin/base/classify/create', controller.backend.classify.addClassify);
  router.post('/admin/base/goods/save', oauth(), activityOauth(), controller.backend.goods.saveGoods);
  router.post('/admin/base/goods/delete', oauth(), activityOauth(), controller.backend.goods.deleteGoods);
  router.get('/admin/base/goods/list', oauth(), activityOauth(), controller.backend.goods.listGoods);

  /**
   * 创建活动
   */
  router.post('/admin/activity/create', oauth(), controller.backend.activity.createActivity);
  /**
   * 我的活动列表
   */
  router.get('/admin/activity/list', oauth(), controller.backend.activity.getActivityList);
  /**
   * 模板列表
   */
  router.get('/admin/activity/getStore', oauth(), controller.backend.activity.getTemplateStore);

  router.post('/admin/award/save', oauth(), activityOauth(), controller.backend.award.saveAward);
  router.get('/admin/award/list', oauth(), activityOauth(), controller.backend.award.getAwardList);
  router.post('/admin/award/delete', oauth(), activityOauth(), controller.backend.award.deleteAward);

  router.get('/admin/logout', controller.backend.page.logout);


  router.get('/admin/volvo/getGameInfo', controller.backend.volvo.getGameResultInfo);
  router.get('/admin/volvo/carSelected', controller.backend.volvo.getCarSelectedInfo);
  router.get('/admin/volvo/getActionInfo', controller.backend.volvo.getActionInfo);
  router.get('/admin/volvo/getAllAward', controller.backend.volvo.getAllAward);
  router.get('/admin/volvo/getGameRank', controller.backend.volvo.getGameRank);
  router.get('/admin/volvo/getPrizeUserList', controller.backend.volvo.getPrizeUserList);
  router.get('/admin/volvo/getRestPrize', controller.backend.volvo.getRestPrize); // 剩下的奖品
  router.get('/admin/volvo/getFlowData', controller.backend.volvo.getFlowData);
  router.get('/admin/volvo/downLoadAllLotteryUser', controller.backend.volvo.downLoadAllLotteryUser);
  router.get('/admin/volvo/downLoadEntityLotteryUser', controller.backend.volvo.downLoadEntityLotteryUser);
};
