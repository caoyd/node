const {Controller} = require('egg');

function g(config = ['silent', 'photograph']) {
  const _map = {
    silent: {
      'context': true,
      'trigger': true
    },
    photograph: {
      'context': true,
      'trigger': true,
      'logo': true
    },
    skin: {
      'color': true,
      'background': true
    }
  };
  let obj = {};
  config.map(c => (obj[c] = _map[c]));
  return obj;
}

class ResourceController extends Controller {

  async saveResource() {
    const {ctx, service} = this;
    const {type, key, value, activityId} = ctx.request.body;
    const {userId} = ctx.session;
    const row = {
      where: {
        userId,
        activityId
      },
      attributes: ['templateId']
    };
    const activity = await service.activity.findOne(row);
    if (activity) {
      const _row = {
        where: {
          id: activity.templateId
        },
        attributes: ['resource']
      };
      const store = await service.templateStore.findOne(_row);
      if (store) {
        const rule = g(store.resource.split(','));
        if (rule && rule[type] && rule[type][key]) {
          const where = {type, key, activityId};
          const params = {value};
          const result = await service.resource.updateOrCreate({where, params}).then(d => !!d);
          ctx.body = ctx.wrapper({result});
        }
      }
    }

  }

  async getResource() {
    const {ctx, service} = this;
    const {activityId, type} = ctx.query;
    const {userId} = ctx.session;
    const row = {
      where: {
        userId, activityId
      },
      attributes: ['templateId']
    };
    const activity = await service.activity.findOne(row);
    if (activity) {
      const _row = {
        where: {
          id: activity.templateId
        },
        attributes: ['resource']
      };
      let store = await service.templateStore.findOne(_row);
      if (store) {
        // console.log(store.resource);
        const rule = g(store.resource.split(','));
        if (rule[type]) {
          const __row = {
            where: {
              type,
              activityId,
            },
            fields: ['id', 'type', 'key', 'value']
          };
          const result = await service.resource.findAll(__row);
          ctx.body = ctx.wrapper({list: result});
        }
      }
    }
  }

}

module.exports = ResourceController;
