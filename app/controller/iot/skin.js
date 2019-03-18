const {Controller} = require('egg');

class SkinController extends Controller {

  async createInstance() {
    const {ctx, service} = this;
    const {id: requestId, tenantId, appId, appType} = ctx.request.body;
    try {
      await service.iot.checkSign('skin');
      await service.iot.checkApp({tenantId, appId, type: 'skin'}).then(d => {
        if (!!d) throw 'app_is_exist';
      });
      const {userId} = await service.iot.createInstance({requestId, tenantId, appId, appType, type: 'skin'});
      ctx.body = ctx.wrapperIot({userId});
    } catch (e) {
      ctx.body = ctx.wrapperIot({}, 203, e);
    }
  }

  async deleteInstance() {
    const {ctx, service} = this;
    const {id: requestId, tenantId, userId, appId} = ctx.request.body;
    try {
      await service.iot.checkSign('skin');
      await service.iot.deleteInstance({requestId, tenantId, userId, appId, type: 'skin'});
      ctx.body = ctx.wrapperIot();
    } catch (e) {
      ctx.body = ctx.wrapperIot({}, 203, e);
    }
  }

  async GetSSOUrl() {
    const {ctx, service} = this;
    const {id: requestId, tenantId, tenantSubUserId, appId, userId} = ctx.request.body;
    try {
      await service.iot.checkSign('skin');
      const ssoUrl = await service.iot.getSSOUrl({requestId, tenantId, tenantSubUserId, appId, userId, type: 'skin'});
      ctx.body = ctx.wrapperIot({ssoUrl});
    } catch (e) {
      ctx.body = ctx.wrapperIot({}, 203, e);
    }
  }

}

module.exports = SkinController;
