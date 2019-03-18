const {Service} = require('egg');

class IotBackFlowService extends Service {
  constructor(ctx) {
    super(ctx);
    this.model = {
      operationLog: ctx.model.IotOperationLog,
    }
  }

  async action({action, itemId, appId, skinDetection}) {
    return this.model.operationLog.create({action, itemId, appId, skinDetection});
  }
}

module.exports = IotBackFlowService;