const baseService = require('./baseService');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
// addClassify

class ClassifyService extends baseService {

  constructor(ctx) {
    super(ctx, ctx.model.Classify)
  }

  async addClassify({name, level, alpha, activityId, children}) {
    return this.create({name, level, alpha, activityId, children});
  }

}

module.exports = ClassifyService;