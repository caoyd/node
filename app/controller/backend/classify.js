const {Controller} = require('egg');

class ClassifyController extends Controller {
  async addClassify() {
    const {ctx, service} = this;
    const {name, level, alpha, activityId, children = null} = ctx.request.body;
    await service.classify.addClassify({name, level, alpha, activityId, children});
    ctx.body = ctx.wrapper({success: true});
  }
}

module.exports = ClassifyController;