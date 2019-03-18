const {Service} = require('egg');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
let seed = 1;

class SpiritService extends Service {

  constructor(ctx) {
    super(ctx);
    this._model = {
      spirit: ctx.model.H5Spirit,
      award: ctx.model.H5SpiritAward,
      log: ctx.model.H5SpiritLog
    };
  }

  async findAllData() {
  	return this._model.spirit.findAll();
  }

  async getInfo(mixNick) {
    const row = {
      where: {
        mixNick
      }
    };
    return this._model.spirit.findOne(row);
  }

  async updateUser(mixNick, awardCode, isAward) {
    const row = {
      where: {
        mixNick
      }
    };
    const params = {
      chance: 0,
      award: awardCode,
      isAward
    };
    return this._model.spirit.update(params, row);
  }

  async create(mixNick) {
    return this._model.spirit.create({mixNick, chance: 1});
  }

  async awardPrizes(mixNick) {
    const user = await this.getInfo(mixNick);
    if (!user) {
      throw new Error('用户不存在');
    }
    if (user.isAward) {
      throw new Error('奖品已经发放');
    }
    return this._model.spirit.update({isAward: true}, {where: {mixNick}});
  }

  async log({mixNick, action, log = ''}) {
    await this._model.log.create({mixNick, action, log});
  }

  async intoPark(mixNick) {
    const row = {
      where: {
        mixNick
      }
    };
    const params = {
      lastInto: this.ctx.getNowFormatDate()
    };
    return this._model.spirit.update(params, row);
  }

  async getAward() {
    let awards = await this._model.award.findAll().then(d => JSON.parse(JSON.stringify(d)));
    let [thanks, coupon, award] = awards;

    if (award.extract >= award.total) {
      thanks.probability = thanks.probability + award.probability;
      awards = [thanks, coupon];
    }
    let random = ~~(this.random() * 100);
    console.log('random', random);
    return this.getItem(awards, random);
  }

  async extractItem(awardCode) {
    const row = {
      where: {
        awardCode
      }
    };
    const params = {
      extract: Sequelize.literal('extract + 1')
    };
    return this._model.award.update(params, row);
  }

  getItem(array, random) {
    console.log(array);
    for (let i = 0; i < array.length; i++) {
      random = random - array[i].probability;
      if (random < 0) {
        console.log(random, i, array[i].awardCode)
        return array[i];
      }
    }
  }

  random() {
    let x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }


}

module.exports = SpiritService;
