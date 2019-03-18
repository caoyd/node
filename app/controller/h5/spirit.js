const {Controller} = require('egg');

class SpiritController extends Controller {

  async findAllData() {
    const {ctx, service} = this;
    const {token} = ctx.query;
    if(token === 'youyu'){
      const result = await service.spirit.findAllData();
      ctx.body = ctx.wrapper({result});
    }
  }

  async getInfo() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    if (!mixNick) {
      ctx.body = ctx.wrapper({chance: 0});
      return;
    }
    let userInfo = await service.spirit.getInfo(mixNick);
    if (!userInfo) {
      userInfo = await service.spirit.create(mixNick);
    }
    ctx.body = ctx.wrapper({chance: userInfo.chance});
  }

  async lottery() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    if (!mixNick) {
      ctx.body = ctx.wrapper({code: 'thanks'});
      return;
    }
    const user = await service.spirit.getInfo(mixNick);
    if (user.chance > 0) {
      const item = await service.spirit.getAward();
      const {awardCode} = item;
      const isAward = awardCode !== 'award';
      await service.spirit.updateUser(mixNick, awardCode, isAward);
      await service.spirit.extractItem(awardCode);
      service.spirit.log({mixNick, action: 'getAward', log: `get award_code: ${awardCode}`});
      ctx.body = ctx.wrapper({code: awardCode});
    } else {
      ctx.body = ctx.error({code: 2201, msg: 'no_choice', notice: '您已经抽过奖了'});
    }
  }

  async awardPrizes() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    try {
      const [result] = await service.spirit.awardPrizes(mixNick);
      service.spirit.log({mixNick, action: 'awardPrizes'});
      ctx.body = ctx.wrapper({success: !!result});
    } catch (e) {
      console.log(e);
      ctx.body = ctx.error({code: 2002, e});
    }
  }

  async intoPark() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    const [result] = await service.spirit.intoPark(mixNick);
    service.spirit.log({mixNick, action: 'intoPark'});
    ctx.body = ctx.wrapper({success: !!result});
  }

  async recall() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    const userInfo = await service.spirit.getInfo(mixNick);
    if (!userInfo) {
      ctx.body = ctx.error({msg: 'INVALID_USER', code: 3330, notice: '没有该用户的信息记录'});
      return;
    }
    const {award = 'thanks', isAward, lastInto} = userInfo;
    const isInto = new Date() - new Date(lastInto) < 12 * 60 * 60 * 1000;
    ctx.body = ctx.wrapper({mixNick, award: award, isAward, isInto});
  }

}

module.exports = SpiritController;
