const {Service} = require('egg');
const Sequelize = require('sequelize');
const {Op} = Sequelize;

// SEO记录服务
class SeoService extends Service {

  constructor(ctx) {
    super(ctx);
    this.logModel = ctx.model.H5SeoLog;
  }

  async log(params) {
    await this.logModel.create(params);
  }

  async getData() {
    const row = {
      where: {
        pv: 1
      },
      attributes: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d'), 'dateTime'],
        [Sequelize.fn('count', Sequelize.col('pv')), 'pv']],
      group: Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d')
    };
    const uVrow = {
      where: {
        uv: 1
      },
      attributes: [[Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d'), 'dateTime'],
        [Sequelize.fn('count', Sequelize.col('uv')), 'uv']],
      group: Sequelize.fn('DATE_FORMAT', Sequelize.col('created_at'), '%Y-%m-%d')
    };
    const pv = await this.logModel.findAll(row);
    const uv = await this.logModel.findAll(uVrow);
    return {
      pv, uv
    };
  }
}

module.exports = SeoService;
