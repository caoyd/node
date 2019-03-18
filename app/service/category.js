const baseService = require('./baseService');

class CloudClassificationService extends baseService {

  constructor(ctx) {
    super(ctx, ctx.model.Category);
  }

  async save({activityId, cid, pic, parentId, name}) {
    const {ctx} = this;
    if (cid) {
      const row = {
        where: {
          activityId, cid
        }
      };
      const params = {
        pic,
        name
      };
      const result = await this.update({row, params});
      return ctx.wrapper({result: !!result, cid});
    } else {
      const result = await this.create({activityId, pic, parentId, name});
      return ctx.wrapper({result: !!result, cid: result.cid});
    }
  }

  async deleteCategory({activityId, cids}) {
    const _row = {
      where: {
        activityId,
        cid: {
          $or: cids.split(',')
        }
      }
    };
    const result = await this.delete(_row);
    return this.ctx.wrapper({result: !!result});
  }
}

module.exports = CloudClassificationService;
