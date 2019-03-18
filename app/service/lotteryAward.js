const baseService = require('./baseService');
const sequelize = require('sequelize');

class LotteryAwardService extends baseService {
  constructor(ctx) {
    super(ctx, ctx.model.LotteryAward);
  }

  reduceAward({awardId}) {
    const row = {
      where: {
        awardId
      }
    };
    const params = {
      awardExtract: sequelize.literal('award_extract + 1')
    }
    return this.update({params, row});
  }

  async save({awardId, awardName, awardCount, awardLink, awardWeight, activityId}) {
    const {ctx} = this;
    if (!awardName || !awardCount || !awardLink || !awardWeight) {
      return ctx.error({code: '12345', msg: 'MISSING_PARAMS'});
    }
    const params = {
      awardName, awardCount, awardLink, awardWeight,
    };
    const where = {
      activityId,
    };
    if (awardId) {
      where.awardId = awardId;
      const [save] = await this.update({params, row: {where}});
      return ctx.wrapper({result: !!save});
    } else {
      const result = await this.create({...params, ...where});
      return ctx.wrapper({result});
    }
  }
}

module.exports = LotteryAwardService;
