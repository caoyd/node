const {Controller} = require('egg');

/**
 * 大疆云货架
 */
class CategoryController extends Controller {

  async saveCategory() {
    const {ctx, service} = this;
    const {activityId, cid, pic, parentId = -1, name} = ctx.request.body;
    ctx.body = await service.category.save({activityId, cid, pic, parentId, name});
  }

  async getCategoryList() {
    const {ctx, service} = this;
    const {activityId} = ctx.query;
    const _row = {
      where: {activityId}
    };
    const {rows, count} = await service.category.findAndCountAll(_row).then(d => JSON.parse(JSON.stringify(d)));
    ctx.body = ctx.wrapper({list: rows, total: count});
  }

  async deleteCategory() {
    const {ctx, service} = this;
    const {activityId, cids} = ctx.request.body;
    ctx.body = await service.category.deleteCategory({activityId, cids});
  }
}

module.exports = CategoryController;
