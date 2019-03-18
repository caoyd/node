module.exports = app => {
  const {router, controller} = app;
  router.post('/front/device/status', controller.front.device.deviceStatus);
  router.post('/front/device/iashelf', controller.front.device.deviceIashelf);

  router.get('/front/goods/list/base', controller.front.goods.getAllGoodsNoSku);
  router.get('/front/goods/list/detail', controller.front.goods.getAllGoodsContainSkuAndBuyshow);
  router.get('/front/category/goods/list/base', controller.front.goods.getGoodsInCategoryNoSkuWith1);
  router.get('/front/category/goods/listWithN/detail', controller.front.goods.getGoodsInCategoryContainSkuWithN);
  router.get('/front/category/goods/listWithN/base', controller.front.goods.getGoodsInCategoryNoSkuWithN);

  router.get('/front/union/goods/list', controller.front.union.listGoodsContainSkuUnionActivity); // 无分类

  router.get('/front/resource/get', controller.front.resource.getResource);
  router.get('/front/lottery/get', controller.front.lottery.lotteryFront);

  router.post('/front/user/login', controller.front.lottery.login);
  router.post('/front/user/addTelephone', controller.front.lottery.addTelephone);
  router.post('/front/photo/upload', controller.front.upload.photoUpload);
  router.get('/front/photo/download/:image', controller.front.upload.photoDownload);

  router.get('/front/skin/report/save', controller.front.skin.saveReport);
  router.get('/front/skin/detail', controller.front.skin.getReport);
  router.get('/front/skin/goods/list', controller.front.goods.getSkinShop);
  router.get('/front/skin/member/check', controller.front.skin.checkIsMember);
  router.get('/front/device/detector', controller.front.device.skinDeviceDetectorFeedback);
  // router.post('/front/skin/log', controller.front.skin.logPost);
  // router.get('/front/skin/log', controller.front.skin.logGet);

};
