const {Service} = require('egg');
const Sequelize = require('sequelize');
const {Op} = Sequelize;

const VOLVO = 'volvo';

class VolvoService extends Service {
  constructor(ctx) {
    super(ctx);
    this.userModel = ctx.model.H5VolvoUser;
    this.gameModel = ctx.model.H5VolvoGame;
    this.awardModek = ctx.model.H5LotteryAward;
  }

  async getUserInfo(mixNick) {
    const row = {
      where: {mixNick},
      attributes: ['userId', 'avatar', 'mixNick', 'playCount', 'gameLottery', 'assistanceLottery', 'assistanceCount', 'address', 'telephone', 'name']
    };
    let user = await this.userModel.findOne(row);
    if (!user) {
      // todo 获取用户头像, 根据这个接口判断用户是否是淘宝用户
      const avatar = await this.service.top.getAvatar(mixNick).then(response => response.avatar);
      // const avatar = 'https://assets.alicdn.com/app/sns/img/default/avatar-120.png';
      const {userId} = await this.userModel.create({mixNick, avatar});
      user = {
        userId,
        mixNick,
        avatar,
        playCount: 0,
        gameLottery: null,
        assistanceLottery: null,
        assistanceCount: null,
        address: null,
        telephone: null,
        name: null
      };
    }
    return user;
  }

  async getFriendAssistanceInfo(userId) {
    const row = {
      where: {
        userId
      }
    };
    return this.userModel.findOne(row);
  }

  /**
   * 助力好友
   * @param activity
   * @param mixNick
   * @param target
   * @returns {Promise<*>}
   */
  async assistFriend({mixNick, target}) {
    return this.service.baseAssistActivity.assistFriend({activity: VOLVO, mixNick, target});
  }

  async getAssistFriends(mixNick, count = 3) {
    return this.service.baseAssistActivity.getAssistFriends(mixNick, count).then(d => {
      if (d.length) {
        return d.map(item => {
          const {user: {avatar}} = item;
          return {
            avatar
          };
        });
      }
      return d;
    });
  }

  async updateAssist({mixNick}) {
    const assistanceCount = Sequelize.literal('assistance_count + 1');
    return this.updateUser({mixNick, assistanceCount});
  }

  async updateUser({mixNick, ...params}) {
    const row = {
      where: {
        mixNick
      }
    };
    return this.userModel.update(params, row);
  }

  async checkCanAssist({mixNick, target}) {
    return this.service.baseAssistActivity.checkCanAssist({activity: VOLVO, mixNick, target});
  }

  async createGame({mixNick, car}) {
    const playCount = Sequelize.literal('play_count + 1');
    await this.updateUser({mixNick, playCount});
    return this.gameModel.create({mixNick, car});
  }

  async findGame({mixNick, gameId}) {
    const row = {
      where: {
        mixNick,
        gameId
      }
    };
    return this.gameModel.findOne(row);
  }

  async updateScore({mixNick, gameId, costTime}) {
    const row = {
      where: {
        mixNick,
        gameId,
        costTime: null
      }
    };
    return this.gameModel.update({costTime}, row);
  }

  async register({name, telephone, mixNick, address}) {
    const user = await this.userModel.findOne({where: {mixNick}});
    if (user) {
      return this.userModel.update({name, telephone, address}, {where: {mixNick}});
    }
    return [false];
  }

  async getGameRank() {
    const sql = 'SELECT a.mix_nick as mixNick, a.cost_time, u.avatar from h5_volvo_game a left JOIN h5_volvo_game b on a.mix_nick = b.mix_nick and a.cost_time > b.cost_time left join h5_volvo_user u on a.mix_nick = u.mix_nick where a.cost_time is not null and b.cost_time is null order by cost_time limit 0, 10';
    return this.ctx.model.query(sql, { type: Sequelize.QueryTypes.SELECT});
  }

  async getGameRankBackend({pageSize = 10, pageNo = 1}) {
    const sql = `SELECT a.mix_nick as mixNick,a.car, a.cost_time, u.address, u.telephone, u.name from h5_volvo_game a left JOIN h5_volvo_game b on a.mix_nick = b.mix_nick and a.cost_time > b.cost_time left join h5_volvo_user u on a.mix_nick = u.mix_nick where a.cost_time is not null and b.cost_time is null order by cost_time limit ${pageSize * (pageNo - 1)}, ${pageSize}`;
    const list = await this.ctx.model.query(sql, {type: Sequelize.QueryTypes.SELECT});
    const countSql = 'select count(a.mix_nick) count from h5_volvo_game a left JOIN h5_volvo_game b on a.mix_nick = b.mix_nick and a.cost_time > b.cost_time where a.cost_time is not null and b.cost_time is null order by a.cost_time';
    const [count] = await this.ctx.model.query(countSql, {type: Sequelize.QueryTypes.SELECT});
    return {list, count: count.count};
  }

  async getMyRank({mixNick}) {
    const row = {
      where: {
        mixNick,
        costTime: {
          [Op.not]: null
        }
      },
      attributes: ['costTime', 'mixNick', 'car'],
      order: [['costTime', 'asc']],
      // order: [['created_at', 'desc']],
      include: [{
        model: this.userModel,
        as: 'user',
        attributes: ['avatar']
      }]
    };

    const myRank = await this.gameModel.findOne(row).then(d => JSON.parse(JSON.stringify(d)));
    if (myRank) {
      const {costTime} = myRank;
      const sql = `select count(distinct(mix_nick)) count from h5_volvo_game where cost_time < ${costTime} and cost_time is not null order by cost_time`;
      const [before] = await this.ctx.model.query(sql, { type: Sequelize.QueryTypes.SELECT});
      return {
        ...myRank,
        rank: before.count + 1
      };
    } else {
      return null;
    }

  }

  async volvoActionLog(params) {
    return this.service.baseLogActivity.logAction({...params, activity: VOLVO});
  }

  async lottery(activity, mixNick, type) {
    return this.service.baseLotteryActivity.getAward(activity, mixNick, type);
  }

  async recordLottery(activity, mixNick, award, type) {
    await this.service.baseLotteryActivity.extractItem(activity, award);
    await this.service.baseLotteryActivity.recordLotteryInfo({activity, mixNick, award, type});
    return true;
  }

  // 每日留下资料人数
  async stayData() {
    const row = {
      where: {
        address: {
          [Op.not]: null
        }
      },
      attributes: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d'), 'dateTime'],
        [Sequelize.fn('count', Sequelize.col('address')), 'address']],
      group: Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d')
    };
    return this.userModel.findAll(row);
  };

  // 剩余奖品restPrize
  async restPrize() {
    const row = {
      where: {
        activity: 'volvo_game',
        awardCode: {
          [Op.and]: [{
            [Op.not]: 'thanks'
          }, {
            [Op.not]: 'cash'
          }]
        }
      },
      attributes: ['count', 'count_extract', 'award_code']
    };
    return await this.awardModek.findAll(row);
  }

  async getGameData() {
    const success = await this.gameModel.count({
      where: {
        costTime: {
          [Op.lt]: 6001
        },
      }
    });
    const fail = await this.gameModel.count({
      where: {
        costTime: {
          [Op.or]: [{
            [Op.gte]: 6001
          }, {
            [Op.eq]: null
          }]
        },
      }
    });
    return {
      success,
      fail
    };
  }

  async getCarSelectedInfo() {
    const row = {
      attributes: [[Sequelize.fn('count', Sequelize.col('car')), 'count'], 'car'],
      group: 'car',
    };
    return this.gameModel.findAll(row);
  }

  async getActionList() {
    return this.service.baseLogActivity.getActionList(VOLVO);
  }

  async getAllAward(activity) {
    let todayZero = ~~(+new Date() / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000);
    return this.service.baseLotteryActivity.findAwardList(activity).then(data => {
      return data.map(i => {
        const {awardName, count, countExtract, todayExtract, updated_at} = i;
        const isToday = (todayZero - new Date(updated_at).getTime()) < 0;
        return {
          awardName,
          count,
          countExtract,
          todayExtract: isToday ? todayExtract : 0
        };
      });
    });
  }

  async getPrizeUserList({pageSize = 10, pageNo = 1}) {
    const row = {
      where: {
        [Op.or]: [{
          gameLottery: {
            [Op.not]: null
          }
        }, {
          assistanceLottery: {
            [Op.not]: null
          }
        }]
      },
      limit: parseInt(pageSize),
      offset: pageSize * (pageNo - 1),
      include: [
        {
          model: this.ctx.model.H5LotteryRecord,
          as: 'award',
          attributes: ['created_at', 'award', 'type', 'activity'],
        }
      ]
    };
    return this.userModel.findAndCountAll(row);
  }

  async getAllLotteryUser() {
    const row = {
      where: {
        [Op.or]: [{
          gameLottery: {
            [Op.not]: null
          }
        }, {
          assistanceLottery: {
            [Op.not]: null
          }
        }]
      },
      include: [
        {
          model: this.ctx.model.H5LotteryRecord,
          as: 'award',
          attributes: ['created_at', 'award', 'type', 'activity'],
        }
      ]
    };
    return this.userModel.findAll(row);

  }

  async getEntityLotteryUser() {
    const row = {
      where: {
        [Op.or]: [{
          gameLottery: {
            [Op.and]: [{
              [Op.not]: null
            }, {
              [Op.not]: 'cash'
            }]
          }
        }, {
          assistanceLottery: {
            [Op.and]: [{
              [Op.not]: null
            }, {
              [Op.not]: 'cash'
            }]
          }
        }]
      },
      include: [
        {
          model: this.ctx.model.H5LotteryRecord,
          as: 'award',
          attributes: ['created_at', 'award', 'type', 'activity'],
        }
      ]
    };
    return this.userModel.findAll(row);
  };

  async checkShare(mixNick) {
    return this.service.baseLogActivity.checkShare({mixNick, activity: VOLVO});
  }

  async checkCopy(mixNick) {
    return this.service.baseLogActivity.checkCopy({mixNick, activity: VOLVO});
  }

}

module.exports = VolvoService;
