const {Service} = require('egg');
const Sequelize = require('sequelize');
const {Op} = Sequelize;

// 天猫精灵服务
class HomeFairService extends Service {

  async getAllTmallInfo() {
    const normal = await this.ctx.model.H5HomefairUserNormal.findAll();
    const galanzsl = await this.ctx.model.H5HomefairUserGalanzsl.findAll();
    return {
      normal,
      galanzsl
    }
  }

  async getUserInfo({mixNick, shopKey}) {
    if (shopKey === 'galanzsl') {
      return this.glzInfo({mixNick, shopKey});
    }
    return this.normalInfo({mixNick, shopKey});
  }

  async normalInfo({mixNick, shopKey}) {
    const row = {
      where: {
        mixNick
      },
      attributes: ['mixNick', 'shopKey', 'isReceive', 'follow', 'cart']
    };
    let user = await this.ctx.model.H5HomefairUserNormal.findOne(row);
    if (!user) {
      await this.ctx.model.H5HomefairUserNormal.create({mixNick, shopKey});
      return {
        'mixNick': mixNick, 'shopKey': shopKey, 'isReceive': false, 'follow': false, 'cart': false
      };
    }
    if (user.shopKey !== shopKey && !user.follow && !user.cart) {
      await this.ctx.model.H5HomefairUserNormal.update({shopKey}, {where: {mixNick}});
      user.shopKey = shopKey;
    }
    return user;
  }

  async recallInfo({mixNick}) {
    const row = {
      where: {
        mixNick
      },
      attributes: ['mixNick', 'shopKey', 'isReceive', 'follow', 'cart']
    };
    return this.ctx.model.H5HomefairUserNormal.findOne(row);
  }

  async glzInfo({mixNick, shopKey}) {
    const row = {
      where: {
        mixNick,
        shopKey
      },
      attributes: ['mixNick', 'shopKey', 'isReceive', 'follow', 'cart', 'followLottery', 'cartLottery', 'address', 'name', 'telephone']
    };
    let user = await this.ctx.model.H5HomefairUserGalanzsl.findOne(row);
    if (!user) {
      await this.ctx.model.H5HomefairUserGalanzsl.create({mixNick, shopKey});
      user = {
        'mixNick': mixNick,
        'shopKey': shopKey,
        'isReceive': false,
        'follow': false,
        'cart': false,
        'followLottery': null,
        'cartLottery': null,
        'address': null,
        'name': null,
        'telephone': null
      };
    }
    return user;
  }

  async getItem({shopKey}) {
    const row = {
      where: {
        shopKey
      },
      attributes: ['itemId', 'skuId']
    };
    const item = await this.ctx.model.H5HomefairItem.findOne(row);
    if (item.skuId) {
      return `${item.itemId}_${item.skuId}_1`;
    }
    return `${item.itemId}_0_1`;
  }

  async register({shopKey, mixNick, address, telephone, name}) {
    console.log(shopKey, mixNick, address, telephone, name);
    const row = {
      where: {
        mixNick, shopKey
      }
    };
    let user = await this.ctx.model.H5HomefairUserGalanzsl.findOne(row);
    console.log(user);
    if (user.followLottery === 'award' || user.cartLottery === 'award') {
      const [result] = await this.ctx.model.H5HomefairUserGalanzsl.update({address, telephone, name}, row);
      return !!result;
    }
    return false;
  }

  async awardPrizes({mixNick}) {
    const row = {
      where: {
        mixNick
      }
    };
    let user = await this.ctx.model.H5HomefairUserNormal.findOne(row);
    if (user.cart && !user.isReceive) {
      const [result] = await this.ctx.model.H5HomefairUserNormal.update({isReceive: true}, row);
      return !!result;
    }
    return false;
  }

  async cart({mixNick, shopKey}) {
    const row = {
      where: {
        mixNick,
        shopKey,
      }
    };
    if (shopKey === 'galanzsl') {
      const [result] = await this.ctx.model.H5HomefairUserGalanzsl.update({cart: true}, row);
      return !!result;
    }
    const [result] = await this.ctx.model.H5HomefairUserNormal.update({cart: true}, row);
    return !!result;
  }

  async follow({mixNick, shopKey}) {
    const row = {
      where: {
        mixNick,
        shopKey
      }
    };
    if (shopKey === 'galanzsl') {
      const [result] = await this.ctx.model.H5HomefairUserGalanzsl.update({follow: true}, row);
      return !!result;
    }
    const [result] = await this.ctx.model.H5HomefairUserNormal.update({follow: true}, row);
    return !!result;
  }

  async getAward() {
    let awards = await this.ctx.model.H5HomefairAward.findAll().then(d => JSON.parse(JSON.stringify(d)));
    let [award, thanks] = awards;
    const isToday = new Date().getTime() - new Date(award.updated_at).getTime() < 86400000;
    if (!isToday) {
      await this.ctx.model.H5HomefairAward.update({todayExtract: 0}, {where: {}});
      award.todayExtract = 0;
      thanks.todayExtract = 0;
    }
    if (award.todayExtract >= award.dailyCount || award.countExtract >= award.count) {
      thanks.probability = thanks.probability + award.probability;
      awards = [thanks];
    }
    let random = ~~(Math.random() * 1000);
    return this.getAwardItem(awards, random);
  }

  async extractItem(name) {
    const row = {
      where: {
        name
      }
    };
    const params = {
      todayExtract: Sequelize.literal('today_extract + 1'),
      countExtract: Sequelize.literal('count_extract + 1'),
    };
    return this.ctx.model.H5HomefairAward.update(params, row);
  }

  getAwardItem(array, random) {
    for (let i = 0; i < array.length; i++) {
      random = random - array[i].probability;
      if (random < 0) {
        return array[i];
      }
    }
  }

  updateGlzInfoAward({mixNick, type, lottery}) {
    const row = {
      where: {
        mixNick
      },
    };
    let params = {};
    if (type === 'cart') {
      params = {
        cartLottery: lottery
      };
    }
    if (type === 'follow') {
      params = {
        followLottery: lottery
      };
    }
    return this.ctx.model.H5HomefairUserGalanzsl.update(params, row);
  }
}

module.exports = HomeFairService;
