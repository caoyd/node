//
const {Controller} = require('egg');
const axios = require('axios');


class PayMenmZFB extends Controller {

  async pay() {
    console.log(1);
    const {ctx, service} = this;
    const {authCode} = ctx.query;
    const data = await service.alipay.tradePay(authCode);
    ctx.body = ctx.wrapper(data);
  }

}

module.exports = PayMenmZFB;