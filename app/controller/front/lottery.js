const {Controller} = require('egg');

class LotteryController extends Controller {
  async lotteryFront() {
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const awards = await service.lotteryAward.findAll({where: {activityId}});
      const result = this.lottery(awards);
      if (result) {
        const {awardLink, awardId, awardCount, awardExtract} = result;
        if (awardCount - awardExtract > 0) {
          await service.lotteryAward.reduceAward({awardId});
          await service.lotteryLog.create({activityId, awardId, user: 'default'});
          ctx.body = ctx.wrapper({result: awardLink, awardId});
        } else {
          await service.lotteryLog.create({activityId, awardId: -1, user: 'default'});
          ctx.body = ctx.wrapper({result: ''});
        }
      } else {
        ctx.body = ctx.error({code: '123', msg: '抽奖失败?'});
      }
    }
  }

  lottery(items) {
    const length = items.length;
    const weight0 = []; // 权重为0
    const weightNo0 = []; // 权重不为0
    let weightTotal = 0;
    const {ceil, random} = Math;
    for (let len = length; len--;) {
      const now = items[len].awardWeight;
      if (!now) weight0.push(items[len]);
      else weightNo0.push(items[len]);
      weightTotal += items[len].awardWeight;
    }
    if (weightTotal) {
      let result = ceil((random() * weightTotal));
      let len = weightNo0.length;
      do {
        len--;
        result -= weightNo0[len].awardWeight;
      } while (result > 0);
      return weightNo0[len];
    } else {
      let result = ceil(random() * (weight0.length - 1));
      return weight0[result];
    }

  }

  async login() {
    const {ctx, service} = this;
    const {mixNick, token: activityOuterId} = ctx.request.body;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {
          mixNick,
          activityId
        },
        attributes: ['telephone']
      };
      const user = await service.taobaoUser.findOne(row);
      if (user) {
        const {telephone} = user;
        ctx.body = ctx.wrapper({result: !!telephone});
      } else {
        ctx.body = ctx.wrapper({result: false});
      }
    }
  }

  async addTelephone() {
    const {ctx, service} = this;
    const {mixNick, telephone, token: activityOuterId} = ctx.request.body;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const where = {mixNick, activityId};
      const params = {telephone};
      await service.taobaoUser.updateOrCreate({where, params});
      ctx.body = ctx.wrapper({result: true});
    }
  }
}

module.exports = LotteryController;
