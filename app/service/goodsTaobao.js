// const {Service} = require('egg');
const baseService = require('./baseService');

class CloudGoodsTaobaoService extends baseService {
  constructor(ctx) {
    super(ctx, ctx.model.GoodsTaobao);
  }

  async deleteGoods({activityId, numIid}) {
    const _row = {where: {activityId, numIid}};
    return this.delete(_row);
  }
}

module.exports = CloudGoodsTaobaoService;
