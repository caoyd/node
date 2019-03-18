const {Controller} = require('egg');

class ViewController extends Controller {

  async adminView() {
    // 管理后台
    const {ctx} = this;
    const {userId} = ctx.session;
    const renderProps = userId ? await this.getAdminPropsByUserId(userId) : await this.getAdminPropsByCode(ctx.query.code);
    ctx.body = await this.renderTemplate(renderProps);
  }

  async activityAdminView() {
    const {ctx, service} = this;

    const {userId} = ctx.session;
    const {activityId} = ctx.query;
    if (userId && activityId) {
      // 用户已经登录了
      const activity = await service.activity.findActivity({activityId, userId});
      if (activity) {
        const user = await service.user.findOne({where: {userId}});
        const company = user.tbNick;
        const onlineUser = {
          avatar: 'https://retail.ews.m.jaeapp.com/public/avatar.png',
          nick: user.tbNick,
        };
        const {path} = await service.templateStore.findTemplate({templateId: activity.templateId});
        ctx.body = await this.renderTemplate({
          company: JSON.stringify(company),
          user: JSON.stringify(onlineUser),
          activityId: activityId,
          path: path,
          template: 'activity.html'
        });
        return;
      }
    }
    ctx.redirect('/admin/index.html', 302);
  }

  async getAdminPropsByUserId(userId) {
    const {service} = this;
    const user = await service.user.findOne({where: {userId}});
    console.log(user);
    if (user) {
      const company = user.tbNick;
      const onlineUser = {
        avatar: 'https://retail.ews.m.jaeapp.com/public/avatar.png',
        nick: user.tbNick,
      };
      return {
        template: '/admin.html',
        company: JSON.stringify(company),
        user: JSON.stringify(onlineUser)
      };
    }
    return this.getAuthProps();
  }

  async getAdminPropsByCode(code) {
    if (code) {
      const _userService = this.service.user;
      const tbUser = await _userService.getTbAuth(code);
      if (tbUser && tbUser.tbUid) {
        this.ctx.session.userId = await _userService.createOrUpdate(tbUser);
        const company = tbUser.tbNick;
        const onlineUser = {
          avatar: 'https://retail.ews.m.jaeapp.com/public/avatar.png',
          nick: tbUser.tbNick,
        };
        return {
          template: '/admin.html',
          company: JSON.stringify(company),
          user: JSON.stringify(onlineUser)
        };
      }
    }
    return this.getAuthProps();
  }

  getAuthProps() {
    const {app} = this;
    const template = 'auth.html';
    const link = `https://oauth.taobao.com/authorize?response_type=code&client_id=${app.config.taobao.AppKey}&redirect_uri=${app.config.taobao.redirectUrl}`;
    return {template, link};
  }

  async renderTemplate({template, ...params}) {
    console.log('template', template);
    return this.ctx.renderView(template, params);
  }

  async managerAdminView() {
    // 管理后台
    const {ctx, service, app} = this;
    // ctx.session.userId = '2bca323d324596b34f2b33aa8fc7ed2b';
    const {code} = ctx.query;
    const {userId} = ctx.session;
    if (userId === '2bca323d324596b34f2b33aa8fc7ed2b') {
      ctx.body = await this.renderTemplate({template: 'manager.html'});
      return;
    } else if (code) {
      const _userService = service.user;
      const tbUser = await _userService.getTbAuth(code);
      if (tbUser && tbUser.tbUid === '4074958541') {
      	ctx.session.userId = '2bca323d324596b34f2b33aa8fc7ed2b';
        ctx.body = await this.renderTemplate({template: 'manager.html'});
        return;
      }
    }
    const template = 'auth.html';
    const link = `https://oauth.taobao.com/authorize?response_type=code&client_id=${app.config.taobao.AppKey}&redirect_uri=https://yoofun.ews.m.jaeapp.com/manager/index.html`;
    ctx.body = await this.renderTemplate({template, link});
  }

}

module.exports = ViewController;
