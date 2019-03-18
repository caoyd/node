const baseService = require('./baseService');
class CloudTaobaoUserService extends baseService {
  constructor(ctx) {
    super(ctx, ctx.model.TaobaoUser);
  }
}

module.exports = CloudTaobaoUserService;
