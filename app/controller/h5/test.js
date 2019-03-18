const {Controller} = require('egg');

class TestController extends Controller {

  async findAllData() {
    const {ctx, service} = this;
    const {token} = ctx.query;
    const result = await service.homeFair.getAllTmallInfo();
    ctx.body = ctx.wrapper({result});
  }

}

module.exports = TestController;
