const {Controller} = require('egg');

class ResourceController extends Controller {
  async getResource() {
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {
          activityId
        },
        attributes: ['id', 'type', 'key', 'value']
      };
      const result = await service.resource.findAll(row);
      ctx.body = ctx.wrapper({list: result});
    }
  }
}

module.exports = ResourceController;
