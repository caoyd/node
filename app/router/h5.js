module.exports = app => {
  const {router, controller} = app;
  // router.get('/spirit/info', controller.h5.spirit.getInfo);
  // router.get('/spirit/lottery', controller.h5.spirit.lottery);
  // router.get('/spirit/recall/info', controller.h5.spirit.recall);
  // router.get('/spirit/recall/prize', controller.h5.spirit.awardPrizes);
  // router.get('/spirit/recall/into', controller.h5.spirit.intoPark);



  // router.get('/homefair/info', controller.h5.homefair.getInfo); // 获取用户信息
  // router.get('/homefair/recall', controller.h5.homefair.recall); // 核销页面信息获取
  // router.get('/homefair/lottery', controller.h5.homefair.lottery); // 抽奖
  // router.get('/homefair/register', controller.h5.homefair.register); // 填写中奖用户信息
  // router.get('/homefair/award', controller.h5.homefair.awardPrizes); // 核销
  // router.get('/homefair/cart', controller.h5.homefair.cart); // 加购
  // router.get('/homefair/follow', controller.h5.homefair.follow); // 关注


  router.get('/volvo/info', controller.h5.volvo.getInfo); // 获取用户信息
  router.get('/volvo/assistance/get', controller.h5.volvo.assistanceInfo); // 获取好友的助力次数
  router.get('/volvo/assist', controller.h5.volvo.assist); // 助力好友
  router.post('/volvo/game/start', controller.h5.volvo.startGame); // 开始游戏
  router.post('/volvo/score/upload', controller.h5.volvo.scoreUpload); // 上传分数
  router.post('/volvo/user/register', controller.h5.volvo.register); // 用户信息填写
  router.post('/volvo/user/log', controller.h5.volvo.log); // 上传打点信息
  router.get('/volvo/game/rank', controller.h5.volvo.rank); // 获取排行榜数据
  router.get('/volvo/game/lottery', controller.h5.volvo.gameLottery); // 游戏抽奖
  router.get('/volvo/assistance/lottery', controller.h5.volvo.assistanceLottery); // 助力抽奖
  router.get('/volvo/seo', controller.h5.volvo.seo); // 助力抽奖


  router.get('/wx/getSecrentToken', controller.wx.wxPro.getSecrentToken);
  router.get('/wx/test', controller.wx.wxPro.test1);

};
