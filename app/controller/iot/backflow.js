const {Controller} = require('egg');

class BackFlowController extends Controller {

  async action() {
    const {ctx, service} = this;
    const {action, itemId = null, token: appId, skinDetection = null} = ctx.request.body;
    const result = await service.iotBackflow.action({action, itemId, appId, skinDetection});
    ctx.body = ctx.wrapper({success: !!result});
  }



}

module.exports = BackFlowController;