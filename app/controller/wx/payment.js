// https://api.mch.weixin.qq.com/pay/micropay
const {Controller} = require('egg');
const axios = require('axios');
const appId = 'wxd7ae9a1699887a73';
const mchId = '1523446461';

class PaymentController extends Controller {

  async pay() {
    const xml = ``
  }

  getNonceStr() {

  }
}

module.exports = PaymentController;