const baseService = require('./baseService');
const axios = require('axios');

class UserService extends baseService {

  constructor(ctx) {
    super(ctx, ctx.model.User);
  }

  updateTB({userId, tbUid, tbNick, topSession, lastName, timeout}) {
    const row = {
      where: {
        userId, tbUid
      }
    };
    const params = {
      tbNick, topSession, lastName, timeout
    };
    return this.update({params, row});
  }

  findUser({tbUid, userId}) {
    let row = {};
    if (userId) {
      row = {
        where: {
          userId
        }
      };
    }
    if (tbUid) {
      row = {
        where: {
          tbUid
        }
      };
    }
    return this.findOne(row);
  }

  async getTbAuth(code) {
    const {app} = this;
    const tbUser = await axios({
      method: 'post',
      url: 'https://oauth.taobao.com/token',
      params: {
        grant_type: 'authorization_code',
        client_id: app.config.taobao.AppKey,
        client_secret: app.config.taobao.AppSecret,
        code,
        redirect_uri: app.config.taobao.redirectUrl,
      }
    }).then(response => response.data);
    return {
      tbUid: tbUser.taobao_user_id,
      tbNick: decodeURIComponent(tbUser.taobao_user_nick),
      topSession: tbUser.refresh_token,
      lastName: tbUser.sub_taobao_user_nick ? decodeURIComponent(tbUser.sub_taobao_user_nick) : decodeURIComponent(tbUser.taobao_user_nick),
      timeout: tbUser.w2_expires_in
    };
  }

  async createOrUpdate(tbUser) {
    const user = await this.findUser({tbUid: tbUser.tbUid});
    let userId;
    if (user) {
      await this.updateTB({...tbUser, userId: user.userId});
      userId = user.userId;
    } else {
      userId = this.ctx.makeId();
      await this.create({...tbUser, userId});
    }
    return userId;
  }

}

module.exports = UserService;
