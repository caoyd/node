const {Controller} = require('egg');

class CommonController extends Controller {

  async createInstance() {
    const {ctx, service} = this;
    const {id: requestId, tenantId, appId, appType} = ctx.request.body;
    const {type} = ctx.params;
    try {
      await service.iot.checkSign(type);
      await service.iot.checkApp({tenantId, appId, type}).then(d => {
        if (!!d) throw 'app_is_exist';
      });
      const {userId} = await service.iot.createInstance({requestId, tenantId, appId, appType, type});
      ctx.body = ctx.wrapperIot({userId});
    } catch (e) {
      ctx.body = ctx.wrapperIot({}, 203, e);
    }
  }
  async deleteInstance() {
    const {ctx, service} = this;
    const {id: requestId, tenantId, userId, appId} = ctx.request.body;
    const {type} = ctx.params;
    try {
      await service.iot.checkSign(type);
      await service.iot.deleteInstance({requestId, tenantId, userId, appId, type});
      ctx.body = ctx.wrapperIot();
    } catch (e) {
      ctx.body = ctx.wrapperIot({}, 203, e);
    }
  }

  async GetSSOUrl() {
    const {ctx, service} = this;
    const {id: requestId, tenantId, tenantSubUserId, appId, userId} = ctx.request.body;
    const {type} = ctx.params;
    try {
      await service.iot.checkSign(type);
      const ssoUrl = await service.iot.getSSOUrl({requestId, tenantId, tenantSubUserId, appId, userId, type});
      ctx.body = ctx.wrapperIot({ssoUrl});
    } catch (e) {
      ctx.body = ctx.wrapperIot({}, 203, e);
    }
  }

}

module.exports = CommonController;
