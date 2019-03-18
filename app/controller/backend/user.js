const {Controller} = require('egg');

class userController extends Controller {


  async login() {
    const {ctx} = this;
    const {userId} = ctx.request.body;
    if (userId) {
      ctx.session.userId = userId;
      ctx.body = ctx.wrapper({success: true});
    } else {
      ctx.body = ctx.wrapper({success: false});
    }
  }

  async list() {
    const {ctx, service} = this;
    const {pageSize = 20, pageNo = 1} = ctx.query;
    const offset = (pageNo - 1) * pageSize;
    const limit = parseInt(pageSize);
    const attributes = ['userId', 'tbNick'];
    const order = [['created_at', 'DESC']];
    const {rows, count} = await service.user.findAndCountAll({offset, limit, attributes, order});
    ctx.body = ctx.wrapper({list: rows, total: count});
  }
}

module.exports = userController;
