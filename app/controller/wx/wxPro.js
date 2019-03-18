const {Controller} = require('egg');

const axios = require('axios');
const appId = 'wxd7ae9a1699887a73';
const token = 'yoofun1314';
let secretToken = '';
const appSecret = '6c179dfc47901a28a414406019f5585c';
const EncodingAESKey = '4OzP5LY2tqFKOzvE0w8s8aB5LXRDfoCcCjm1p2DWJas';
const openId = 'ouuy75r11dEhV5Uo3KIWjHbbhDBQ';

class TestWx extends Controller {
 // access_token
  async getSecrentToken() {
    const {ctx, service} = this;
    const data = await axios.get('https://api.weixin.qq.com/cgi-bin/token', {params: {grant_type: 'client_credential', appid: 'wxd7ae9a1699887a73', secret: '6c179dfc47901a28a414406019f5585c'}}).then(d => d.data);
    secretToken = data.access_token;
    ctx.body = ctx.wrapper(data);
  }

  async test1() {
    const {ctx, service} = this;
    const {signature, timestamp, nonce, echostr} = ctx.query;
    let strArr = [token, timestamp, nonce];
    strArr = strArr.sort();
    let str = strArr.join('');
    const sha1 = crypto.createHash('sha1').update(str).digest('hex');
    console.log('sha1==', sha1);
    console.log('signature==', signature);
    if (sha1 == signature) {
      ctx.body = echostr;
      return;
    }
    ctx.body = ctx.error({code: 2000, msg: 'error'});
    // console.log(token);
    // console.log('test');
  }

}

module.exports = TestWx;