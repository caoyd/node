const {Service} = require('egg');
const AlipaySdk = require('alipay-sdk').default;
const fs = require('fs');
const appId = '2018123162719597';
const aes = 'HM54Ze3UtZxlZuubbwrOjw==';
const path = require('path');
const publicKey = fs.readFileSync(path.resolve(__dirname, '../lib/alipay/public_key.pem'), 'ascii');
const privyKey = fs.readFileSync(path.resolve(__dirname, '../lib/alipay/private_key.pem'), 'ascii');
// https://openapi.alipay.com/gateway.do
let num = 1;
class AlipayService extends Service {

  async request({api, params}) {
    const alipaySdk = new AlipaySdk({
      appId: appId,
      privateKey: privyKey,
      alipayPublicKey: publicKey,
    });
    return alipaySdk.exec(api, {...params});

  }

  async tradePay(authCode) {
    num++;
    const params = {
      out_trade_no: num.toString(),
      subject: 'test',
      auth_code: authCode,
      scene: 'bar_code'
    };
    return this.request({api: 'alipay.trade.pay', params})
  }

  getSign() {

  }

}

module.exports = AlipayService;