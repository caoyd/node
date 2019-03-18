const {Controller} = require('egg');

class ActivityController extends Controller {

  async createActivity() {
    const {ctx, service} = this;
    const {activityName, deviceId, storeId, templateId} = ctx.request.body;
    const {userId} = ctx.session;

    ctx.body = await service.activity.createActivity({activityName, deviceId, storeId, templateId, userId});
  }

  async getActivityList() {
    const {ctx, service} = this;
    const {userId} = ctx.session;
    console.log('-----------', userId);
    ctx.body = await service.activity.getMyActivityList({userId});
  }

  async getTemplateStore() {
    const {ctx, service} = this;
    ctx.body = await service.templateStore.findAllTemplate();
  }

}

module.exports = ActivityController;
