const {Service} = require('egg');

class BaseAssistActivityService extends Service {

  constructor(ctx) {
    super(ctx);
    this.configModel = ctx.model.H5AssistanceConfig;
    this.recordModel = ctx.model.H5AssistanceRecord;
  }

  getAssistConfig(activity) {
    const row = {
      where: {
        activity
      }
    };
    return this.configModel.findOne(row);
  }

  recordAssist(params) {
    return this.recordModel.create(params);
  }

  getAssistRecord(options) {
    const row = {
      raw: true,
      where: options,
      order: [['created_at', 'desc']]
    };
    return this.recordModel.findAll(row);
  }


  async assistFriend({activity, mixNick, target}) {
    const result = await this.checkCanAssist({activity, mixNick, target});
    if (result) {
      return this.recordAssist({activity, mixNick, target});
    }
  }

  async checkCanAssist({activity, mixNick, target}) {
    const config = await this.getAssistConfig(activity);
    const {dailyAssistanceCount, totalAssistanceCount, dailySameUserCount, totalSameUserCount} = config;
    let record = await this.getAssistRecord({activity, mixNick});
    let todayZero = ~~(+new Date() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    if (totalAssistanceCount) {
      if (totalAssistanceCount <= record.length) {
        throw {
          code: 2201,
          msg: 'total_assistance_limit',
          notice: '你的协助次数已经达到上线了'
        };
      }
    }
    if (dailyAssistanceCount) {
      const dailyRecord = await record.filter(item => item.created_at > todayZero);
      if (dailyAssistanceCount <= dailyRecord.length) {
        throw {
          code: 2202,
          msg: 'daily_assistance_limit',
          notice: '你今日协助次数已经上限了'
        };
      }
    }
    if (totalSameUserCount) {
      const userRecord = await record.filter(item => item.target === target);
      if (totalSameUserCount <= userRecord.length) {
        throw {
          code: 2203,
          msg: 'total_assistance_same_user_limit',
          notice: '你已经协助过该用户了'
        };
      }
    }
    if (dailySameUserCount) {
      const userRecord = await await record.filter(item => item.target === target && item.created_at > todayZero);
      if (dailySameUserCount <= userRecord.length) {
        throw {
          code: 2204,
          msg: 'daily_assistance_same_user_limit',
          notice: '你今日已经协助过该用户了'
        };
      }
    }
    return true;
  }

  async getAssistFriends(mixNick, count) {
    const row = {
      where: {
        target: mixNick
      },
      limit: count,
      offset: 0,
      order: [['created_at', 'desc']],
      attributes: ['mixNick'],
      include: [{
        model: this.ctx.model.H5VolvoUser,
        as: 'user',
        attributes: ['avatar']
      }]
    };
    return this.recordModel.findAll(row);
  };


}

module.exports = BaseAssistActivityService;
