const {Service} = require('egg');
const Sequelize = require('sequelize');

class BaseLotteryService extends Service {

  constructor(ctx) {
    super(ctx);
    this.awardModel = ctx.model.H5LotteryAward;
    this.activityModel = ctx.model.H5LotteryActivity;
    this.recordModel = ctx.model.H5LotteryRecord;
  }

  findAwardList(activity) {
    const row = {
      where: {
        activity
      }
    };
    return this.awardModel.findAll(row);
  }

  findActivity(activity) {
    const row = {
      where: {
        activity
      }
    };
    return this.activityModel.findOne(row);
  }

  lottery(awardList, algorithm = 'normal') {
    if (awardList.length === 0) {
      throw {
        code: 4040,
        msg: 'award_finished',
        notice: '奖品已经发放完毕了,请下次在参与哦'
      };
    }
    if (algorithm === 'normal') {
      let probability = 0;
      awardList.forEach((item) => {
        probability = probability + item.probability;
      });
      let random = ~~(Math.random() * probability);
      console.log(probability, random);
      const item = this.getAwardItem(awardList, random);
      return item.awardCode;
    }
  }

  getAwardItem(array, random) {
    for (let i = 0; i < array.length; i++) {
      random = random - array[i].probability;
      if (random < 0) {
        return array[i];
      }
    }
  }

  checkActivityTimeLimit(activity) {
    const {startTime, endTime} = activity;
    if (!startTime && !endTime) {
      return true;
    }
    const now = +new Date();
    if (endTime && now > +new Date(endTime)) {
      throw {
        code: 3000,
        msg: 'activity_is_expire',
        notice: '活动已经过期'
      };
    }
    if (startTime && now < +new Date(startTime)) {
      throw {
        code: 3001,
        msg: 'activity_is_not_start',
        notice: '活动还未开始'
      };
    }
    return true;
  }

  async checkActivityCountLimit(activity, mixNick) {
    const {dailyCount, totalCount} = activity;
    if (!dailyCount && !totalCount) {
      return true;
    }
    let record = await this.getLotteryRecord({activity: activity.activity, mixNick});
    let todayZero = ~~(+new Date() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    if (totalCount) {
      const dailyRecord = await record.filter(item => item.created_at > todayZero);
      if (totalCount <= dailyRecord.length) {
        throw {
          code: 2202,
          msg: 'total_lottery_limit',
          notice: '你的抽奖次数已经上限了'
        };
      }
    }
    if (dailyCount) {
      if (dailyCount <= record.length) {
        throw {
          code: 2201,
          msg: 'daily_lottery_limit',
          notice: '你今日的抽奖次数已经上限了'
        };
      }
    }
    return true;
  }

  async checkActivity(activity, mixNick) {
    if (!activity) {
      throw {
        code: 3003,
        msg: 'activity_not_exist',
        notice: '活动不存在'
      };
    }
    this.checkActivityTimeLimit(activity);
    await this.checkActivityCountLimit(activity, mixNick);
    return true;
  }

  async getAward(activityName, mixNick, type) {
    const activity = await this.findActivity(activityName).then(d => JSON.parse(JSON.stringify(d)));
    await this.checkActivity(activity, mixNick);
    const awardList = await this.getAwardList(activityName);
    console.log(awardList);
    const award = this.lottery(awardList, activity.algorithm);
    await this.extractItem(activityName, award);
    await this.recordLotteryInfo({activity: activityName, mixNick, award, type});
    return award;
  }

  async extractItem(activity, awardCode) {
    const row = {
      where: {
        activity,
        awardCode
      }
    };
    const params = {
      todayExtract: Sequelize.literal('today_extract + 1'),
      countExtract: Sequelize.literal('count_extract + 1'),
    };
    return this.awardModel.update(params, row);
  }


  async updateAward(params, where) {
    const row = {where};
    return this.awardModel.update(params, row);
  }

  async getAwardList(activityName) {
    let awards = await this.findAwardList(activityName).then(d => JSON.parse(JSON.stringify(d)));
    let todayZero = ~~(+new Date() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    const isToday = (todayZero - new Date(awards[0].updated_at).getTime()) < 0;
    if (!isToday) {
      await this.updateAward({todayExtract: 0}, {activity: activityName});
    }
    return awards.filter(award => !((isToday && award.todayExtract >= award.dailyCount) || award.countExtract >= award.count));
  }

  async recordLotteryInfo(params) {
    return this.recordModel.create(params);
  }

  async getLotteryRecord({activity, mixNick}) {
    let row = {
      where: {activity, mixNick}
    };
    return this.recordModel.findAll(row);
  }

  async getPrizeUserList({activity, pageSize = 20, pageNo = 1}) {
    const row = {
      where: {
        activity
      },
      limit: parseInt(pageSize),
      offset: pageSize * (pageNo - 1),
      attributes: ['created_at', 'award', 'type', 'mixNick'],
      include: [{
        model: this.ctx.model.H5VolvoUser,
        as: 'user',
        attributes: ['name', 'telephone', 'address'],
      }]
    };
    return this.recordModel.findAll(row);
  }


}

module.exports = BaseLotteryService;
