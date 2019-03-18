const baseService = require('./baseService');
class LotteryLogService extends baseService {
  constructor(ctx) {
    super(ctx, ctx.model.LotteryLog);
  }

}

module.exports = LotteryLogService;
