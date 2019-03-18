const {Service} = require('egg');
const Sequelize = require('sequelize');
class BaseLotteryService extends Service {

  constructor(ctx) {
    super(ctx);
    this.logModel = ctx.model.H5ActionLog;
  }

  logAction(params) {
    return this.logModel.create(params);
  }

  getActionList(activity, action) {
    const row = {
      where: {
        activity
      },
      attributes: [[Sequelize.fn('count', Sequelize.col('action')), 'count'], 'action'],
      group: 'action',
    };
    if (action) {
      row.where.action = action;
    }
    return this.logModel.findAll(row);
  }

  async checkShare({mixNick, activity}) {
    const row = {
      where: {
        activity,
        mixNick,
        action: 'share'
      }
    };
    return this.logModel.findOne(row);
  }

  async checkCopy({mixNick, activity}) {
    const row = {
      where: {
        activity,
        mixNick,
        action: 'copy'
      }
    };
    return this.logModel.findOne(row);
  }
}

module.exports = BaseLotteryService;
