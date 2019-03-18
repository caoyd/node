const {Controller} = require('egg');

class pageController extends Controller {
  async routeGet() {
    const {ctx, service} = this;
    const {userId} = ctx.session;
    const {activityId} = ctx.query;
    const activity = await service.activity.findOne({
      where: {
        activityId,
        userId
      }
    });
    if (activity) {
      const {templateId} = activity;
      const template = await service.templateStore.findOne({where: {templateId}});
      const {path} = template;
      const list = JSON.parse(path);
      ctx.body = ctx.wrapper({list, count: list.length});
    }

  }

  async logout() {
    this.ctx.session = null;
    this.ctx.body = this.ctx.wrapper({result: true});
  }

  async login() {
    const {ctx, service} = this;

  }
}

module.exports = pageController;
