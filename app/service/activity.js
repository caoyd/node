const baseService = require('./baseService');

class ActivityService extends baseService {
  constructor(ctx) {
    super(ctx, ctx.model.Activity);
  }

  findActivity({activityId, userId}) {
    const row = {
      where: {
        activityId, userId
      }
    };
    return this.findOne(row);
  }

  async getMyActivityList({userId}) {
    const {ctx} = this;
    const where = {userId};
    const attributes = ['activityName', 'activityOuterId', 'activityId'];
    const include = [{
      model: ctx.model.TemplateStore,
      as: 'template',
      attributes: ['href', 'title', 'type', 'description', 'background']
    }];
    let list = await this.findAll({
      where,
      include,
      attributes
    }).then(d => JSON.parse(JSON.stringify(d)));
    if (list.length) {
      list = list.map(i => {
        const {template, ...activity} = i;
        return {
          ...activity,
          ...template
        };
      });
    }
    return ctx.wrapper({list});
  }

  async createActivity({activityName, deviceId, storeId, templateId, userId}) {
    const {ctx} = this;
    if (activityName && templateId) {
      const activityOuterId = ctx.makeId();
      const {activityId} = await this.create({
        activityName,
        deviceId,
        storeId,
        templateId,
        userId,
        activityOuterId,
        activityId: ctx.makeId()
      });
      return ctx.wrapper({result: true, activityId, activityOuterId});
    } else {
      return ctx.error({code: '4001', msg: 'INVALID_PARAMS'});
    }
  }

  async getUnionActivity({unionId}) {
    const row = {
      where: {
        unionId
      },
      attributes: ['activityOuterId']
    };
    let list = this.findAll(row);
    if (list.length) {
      list = list.map(i => {
        return {
          token: i.activityOuterId
        };
      });
    }
    return {
      token: unionId,
      list
    };
  }
}

module.exports = ActivityService;
