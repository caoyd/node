const baseService = require('./baseService');
const Sequelize = require('sequelize');
const {Op} = Sequelize;
class GoodsService extends baseService {

  constructor(ctx) {
    super(ctx, ctx.model.Goods);
  }

  async findGoodsList({activityId, pageSize, pageNumber}) {
    const {ctx} = this;
    const _row = {
      attributes: ['customBarcode',
        'customDescription',
        'customPicUrl',
        'customPrice',
        'customShowPic',
        'customCid',
        'customTitle',
        'goodsTaobaoId'],
      where: {activityId},
      limit: parseInt(pageSize),
      offset: pageSize * (pageNumber - 1),
      include: [
        {
          model: ctx.model.GoodsTaobao,
          as: 'goodsTaobao',
          where: {activityId},
          attributes: ['picUrl', 'title', 'price', 'barCode'],
          required: false
        },
      ]
    };
    const {rows, count: total} = await this.findAndCountAll(_row).then(d => JSON.parse(JSON.stringify(d)));
    const list = rows.map(({goodsTaobao, ...rest}) => {
      return {...rest, ...goodsTaobao};
    });
    return ctx.wrapper({list, total});
  }

  async deleteGoods({activityId, goodsTaobaoId}) {
    const row = {where: {activityId, goodsTaobaoId}};
    await this.delete(row);
    await this.service.goodsTaobao.deleteGoods({activityId, numIid: goodsTaobaoId});
    return this.ctx.wrapper({result: true});
  }

  async saveGoods({
    activityId,
    goodsTaobaoId,
    customBarcode,
    customShowPic,
    customDescription,
    customPicUrl,
    customPrice,
    customTitle,
    customCid
  }) {
    const {ctx} = this;
    const where = {activityId, goodsTaobaoId};
    const params = {
      customBarcode,
      customShowPic,
      customDescription,
      customPicUrl,
      customPrice,
      customTitle,
      customCid
    };
    const isExist = await this.findOne({where}).then(d => !!d);
    if (isExist) {
      const [result] = await this.update({params, row: {where}});
      return ctx.wrapper({result: !!result});
    }
    const result = this.create({...params, ...where});
    return ctx.wrapper({result: !!result});
  }

  async getGoodsByGoodsIdAndActivityId({goodsIds, activityId}) {
    const {ctx} = this;
    const _row = {
      attributes: ['customBarcode',
        'customDescription',
        'customPicUrl',
        'customPrice',
        'customShowPic',
        'customCid',
        'customTitle',
        'goodsTaobaoId'],
      where: {
        activityId,
        goodsTaobaoId: {
          [Op.or]: goodsIds.split(',')
        }
      },
      include: [
        {
          model: ctx.model.GoodsTaobao,
          as: 'goodsTaobao',
          where: {activityId},
          attributes: ['picUrl', 'title', 'price', 'barCode', 'soldQuantity'],
          required: false
        },
      ]
    };
    const rows = await this.findAll(_row).then(d => JSON.parse(JSON.stringify(d)));
    return rows.map(({goodsTaobao, ...rest}) => {
      return {...rest, ...goodsTaobao};
    });
  }

}

module.exports = GoodsService;
