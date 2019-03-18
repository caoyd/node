const multipartMiddleware = require('connect-multiparty');

module.exports = app => {
  const {router, controller, middlewares: {iotMiddleware}} = app;
  /** ** iot ** **/
  router.post('/iot/:type/createInstance', controller.iot.common.createInstance);
  router.post('/iot/:type/deleteInstance', controller.iot.common.deleteInstance);
  router.post('/iot/:type/GetSSOUrl', controller.iot.common.GetSSOUrl);
  router.get('/iot/index.html', controller.iot.view.iotView);


  /** ** backend ** **/
  router.post('/iot/goods/create', iotMiddleware(), controller.iot.backend.createGoods);
  router.get('/iot/goods/getList', iotMiddleware(), controller.iot.backend.getGoodsList);
  router.post('/iot/goods/update', iotMiddleware(), controller.iot.backend.updateGoods);

  router.get('/iot/app/list', iotMiddleware(), controller.iot.backend.getAppList);
  router.post('/iot/app/update', iotMiddleware(), controller.iot.backend.updateApp);
  router.get('/iot/app/getInfo', iotMiddleware(), controller.iot.backend.getAppInfo);

  router.get('/iot/class/getList', iotMiddleware(), controller.iot.backend.getClassList);
  router.post('/iot/class/create', iotMiddleware(), controller.iot.backend.createClass);
  router.post('/iot/class/update', iotMiddleware(), controller.iot.backend.updateClass);
  router.post('/iot/class/remove', iotMiddleware(), controller.iot.backend.removeClass);

  router.get('/iot/appGoods/getList', iotMiddleware(), controller.iot.backend.getGoodsListInApp);
  router.post('/iot/appGoods/create', iotMiddleware(), controller.iot.backend.addGoodsInApp);
  router.post('/iot/appGoods/update', iotMiddleware(), controller.iot.backend.updateGoodsInApp);
  router.post('/iot/appGoods/remove', iotMiddleware(), controller.iot.backend.deleteGoodsInApp);

  // 信息发布
  router.get('/iot/resource/getList', iotMiddleware(), controller.iot.backend.getResourceList);
  router.post('/iot/resource/create', iotMiddleware(), controller.iot.backend.createResource);

  // 人脸识别

  router.get('/iot/face/getList', iotMiddleware(), controller.iot.backend.getFaceList);
  router.post('/iot/face/createList', iotMiddleware(), controller.iot.backend.createFace);
  router.post('/iot/face/update', iotMiddleware(), controller.iot.backend.updateFace);
  router.post('/iot/face/remove', iotMiddleware(), controller.iot.backend.removeFace);

  router.get('/iot/shop/getList', iotMiddleware(), controller.iot.backend.getShopList);
  router.post('/iot/shop/create', iotMiddleware(), controller.iot.backend.createShop);
  router.post('/iot/shop/update', iotMiddleware(), controller.iot.backend.updateShop);
  router.post('/iot/shop/remove', iotMiddleware(), controller.iot.backend.removeShop);

  router.get('/iot/shop/getNameList', iotMiddleware(), controller.iot.backend.getNameList);


  // 展示回流数据

  router.get('/iot/backFlow/getActionList', iotMiddleware(), controller.iot.backend.getActionList);

  /** backflow **/
  router.post('/iot/backFlow/action', controller.iot.backflow.action);



};
