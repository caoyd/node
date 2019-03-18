const {Controller} = require('egg');

class VolvoController extends Controller {

  async getInfo() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    // if(mixNick) {}
    const info = await service.volvo.getUserInfo(mixNick).then(d => JSON.parse(JSON.stringify(d)));
    const friendAvatar = await service.volvo.getAssistFriends(mixNick);
    const isShare = await service.volvo.checkShare(mixNick);
    const isCopy = await service.volvo.checkCopy(mixNick);
    ctx.body = ctx.wrapper({...info, friendAvatar, isShare: !!isShare, isCopy: !!isCopy});
  }

  async register() {
    const {ctx, service} = this;
    const {name, telephone, mixNick, address} = ctx.request.body;
    const [success] = await service.volvo.register({name, telephone, mixNick, address});
    ctx.body = ctx.wrapper({success: !!success});
  }

  async assistanceInfo() {
    const {ctx, service} = this;
    const {mixNick, userId} = ctx.query;
    try {
      const {assistanceCount, mixNick: friendMixNick} = await service.volvo.getFriendAssistanceInfo(userId);
      const friendAvatar = await service.volvo.getAssistFriends(friendMixNick);

      if (friendMixNick === mixNick) {
        ctx.body = ctx.wrapper({assistanceCount, canAssistance: false, friendAvatar});
        return;
      }
      const canAssistance = await service.volvo.checkCanAssist({mixNick, target: friendMixNick}).catch(() => false);
      ctx.body = ctx.wrapper({assistanceCount, canAssistance, friendAvatar});
    } catch (e) {
      ctx.body = ctx.error({code: 2203, msg: e});
    }
  }

  async assist() {
    const {ctx, service} = this;
    const {mixNick, userId} = ctx.query;
    const user = await service.volvo.getUserInfo(mixNick);
    if (!user) {
      ctx.body = ctx.error({code: 2200, msg: 'error_mixNick', notice: '未获取到用户'});
    }
    const friend = await service.volvo.getFriendAssistanceInfo(userId);
    if (!friend) {
      ctx.body = ctx.error({code: 2200, msg: 'error_friend_info', notice: '未获取到助力用户'});
    }
    try {
      await service.volvo.assistFriend({mixNick, target: friend.mixNick});
      await service.volvo.updateAssist({mixNick: friend.mixNick});
      ctx.body = ctx.wrapper({success: true});
    } catch (e) {
      ctx.body = ctx.error(e);
    }
  }

  async startGame() {
    const {ctx, service} = this;
    const {car, mixNick} = ctx.request.body;
    const {gameId} = await service.volvo.createGame({mixNick, car});
    ctx.body = ctx.wrapper({gameId});
  }

  async scoreUpload() {
    const {ctx, service} = this;
    let {mixNick, gameId, costTime} = ctx.request.body;
    const game = await service.volvo.findGame({mixNick, gameId});

    if (!game) {
      ctx.body = ctx.error({code: 2205, msg: 'game_not_exist'});
    }
    if (parseInt(costTime) === 0) {
      costTime = 5000;
    }
    const [result] = await service.volvo.updateScore({mixNick, gameId, costTime});
    ctx.body = ctx.wrapper({success: !!result});
  }

  async log() {
    // 点击日志
    const {ctx, service} = this;
    const {action, mixNick} = ctx.request.body;
    const success = await this.service.volvo.volvoActionLog({action, mixNick});
    ctx.body = ctx.wrapper({success: !!success});
  }

  async rank() {
    const {ctx, service} = this;
    const {mixNick} = ctx.query;
    const rank = await service.volvo.getGameRank();
    const myRank = await service.volvo.getMyRank({mixNick});
    ctx.body = ctx.wrapper({
      rank,
      myRank
    });
  }

  async gameLottery() {
    const {ctx, service} = this;
    const {mixNick, gameId, gameLottery, type} = ctx.query;
    const user = await service.volvo.getUserInfo(mixNick);
    if (user && !user.gameLottery) {
      const game = await service.volvo.findGame({mixNick, gameId});
      if (game && game.costTime && game.costTime < 2000) {
        if (!gameLottery) {
          try {
            const award = await service.volvo.lottery('volvo_game', mixNick);
            await service.volvo.updateUser({mixNick, gameLottery: award});
            ctx.body = ctx.wrapper({award});
          } catch (e) {
            ctx.body = ctx.error(e);
          }
        } else {
          await service.volvo.recordLottery('volvo_game', mixNick, 'cash', type);
          await service.volvo.updateUser({mixNick, gameLottery});
          ctx.body = ctx.wrapper({success: true});
        }
      } else {
        ctx.body = ctx.error({code: 1198, msg: 'not_chance_lottery', notice: '沒有抽奖机会'});
      }
    } else {
      ctx.body = ctx.error({code: 1197, msg: 'user_error_cant_lottery', notice: '用户不存在/已经抽过奖了'});
    }
  }

  async assistanceLottery() {
    const {ctx, service} = this;
    const {mixNick, assistanceLottery, type} = ctx.query;
    const user = await service.volvo.getUserInfo(mixNick);
    if (user && !user.assistanceLottery && user.assistanceCount >= 10) {
      if (!assistanceLottery) {
        try {
          const award = await service.volvo.lottery('volvo_assistance', mixNick);
          await service.volvo.updateUser({
            mixNick,
            assistanceLottery: award
          });
          ctx.body = ctx.wrapper({award});
        } catch (e) {
          ctx.body = ctx.error(e);
        }
      } else {
        await service.volvo.recordLottery('volvo_assistance', mixNick, 'cash', type);
        await service.volvo.updateUser({mixNick, assistanceLottery});
        ctx.body = ctx.wrapper({success: true});
      }
    } else {
      ctx.body = ctx.error({code: 1197, msg: 'user_error_cant_lottery', notice: '没有抽奖机会'});
    }
  }

  async seo() {
    const {ctx, service} = this;
    const {pv, uv, type} = ctx.query;
    const {header} = ctx.request;
    const agent = header['user-agent'];
    const ip = header['x-real-ip'];
    service.seo.log({ip, agent, pv, uv, type});
    ctx.body = ctx.wrapper({success: true});
  }

}

module.exports = VolvoController;
