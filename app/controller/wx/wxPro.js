const {Controller} = require('egg');
const crypto = require('crypto');
const xml2js = require('xml2js');
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

  async test2() {
    const {ctx} = this;
    let data = '';
    ctx.set('Content-Type', 'text/xml');
    ctx.req.setEncoding('utf8');
    ctx.req.on('data',function(chunk) {
      data += chunk;
    });
    ctx.req.on('end',function() {
      xml2js.parseString(data, {explicitArray: false}, (err, json) => {
        console.log(json);//这里的json便是xml转为json的内容
        const {Content, ToUserName, FromUserName, MsgType} = json.xml;
        const data = {
          xml: {
            ToUserName,
            FromUserName,
            CreateTime: parseInt(new Date().getTime() / 1000),
            MsgType,
            Content: Content + '(测试)',
          }
        };
        const xml =
          `<xml>
            <ToUserName>` + data.xml.ToUserName + `</ToUserName>
            <FromUserName>` + data.xml.FromUserName + `</FromUserName>
            <CreateTime>` + data.xml.CreateTime + `</CreateTime>
            <MsgType>` + data.xml.MsgType + `</MsgType>
            <Content>` + data.xml.Content + `</Content>
          </xml>`;
        ctx.body = xml;
      });

    });

  }

}

module.exports = TestWx;