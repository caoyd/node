const {Controller} = require('egg');


class ViewController extends Controller {

  async iotView() {
    const {ctx, service} = this;
    const {iotUserId} = ctx.session;
    const {token, timestamp} = ctx.query;
    try {
      const tokenInfo = await service.iot.getTokenInfo({token, timestamp, iotUserId});
      const {type} = await service.iot._model.USER.findOne({where: {tenantId: tokenInfo.tenantId}}).then(d => JSON.parse(JSON.stringify(d)));
      ctx.session.iotUserId = tokenInfo.tenantId;
      ctx.body = await this.renderTemplate({template: 'iot.html', deviceType: type});
      return;
    } catch (e) {
      // ctx.body = await this.renderTemplate({template: 'auth.html', link: 'https://account.aliyun.com/login/login.htm?spm=a2c3t.10719541.lm-carousel-show.14.713551e7jTIr7T&oauth_callback=https://linkmarket.aliyun.com/index'});
    }

    if (iotUserId) {
      const {type} = await service.iot._model.USER.findOne({where: {tenantId: iotUserId}}).then(d => JSON.parse(JSON.stringify(d)));
      ctx.body = await this.renderTemplate({template: 'iot.html', deviceType: type});
      return;
    }
    ctx.body = await this.renderTemplate({template: 'auth.html', link: 'https://account.aliyun.com/login/login.htm?spm=a2c3t.10719541.lm-carousel-show.14.713551e7jTIr7T&oauth_callback=https://linkmarket.aliyun.com/index'});


  }

  async renderTemplate({template, ...params}) {
    return this.ctx.renderView(template, params);
  }

}

module.exports = ViewController;
