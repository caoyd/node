const {Controller} = require('egg');

class AwardController extends Controller {

  async saveAward() {
    const {ctx, service} = this;
    const {awardId, awardName, awardCount, awardLink, awardWeight, activityId} = ctx.request.body;
    ctx.body = await service.lotteryAward.save({
      awardId,
      awardName,
      awardCount,
      awardLink,
      awardWeight,
      activityId
    });
  }

  async getAwardList() {
    const {ctx, service} = this;
    const {activityId} = ctx.query;
    const where = {
      activityId
    };
    const {rows, count} = await service.lotteryAward.findAndCountAll({where});
    ctx.body = ctx.wrapper({list: rows, total: count});
  }

  async deleteAward() {
    const {ctx, service} = this;
    const {activityId, awardId} = ctx.request.body;
    const result = await service.lotteryAward.delete({where: {activityId, awardId}});
    ctx.body = ctx.wrapper({result: !!result});
  }

}

module.exports = AwardController;
