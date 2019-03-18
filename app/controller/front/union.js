const {Controller} = require('egg');

// const config = require('./config.json');

class GoodsController extends Controller {

  async listGoodsContainSkuUnionActivity() {
    const {ctx, service} = this;
    const {token} = ctx.query;
    const activities = await service.activity.getUnionActivity({union: token});
    if (activities) {
      const length = activities.list.length;
      for (let i = 0; i < length; i++) {
        const {token: activityOuterId} = activities.list[i];
        activities.list[i].list = await this.listGoodsContainSku({activityOuterId});
        // activities.list[i].couponUrl = await this.getActivityAward({activityOuterId});
      }
      ctx.body = ctx.wrapper(activities);
    } else {
      ctx.body = ctx.error({code: '1234', msg: 'ERROR_PARAMS_UNION_TOKEN'});
    }
  }

  async listGoodsContainSku({activityOuterId}) {
    const {ctx, service} = this;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {activityId},
        attributes: ['goodsTaobaoId', 'customTitle', 'customPrice', 'customPicUrl', 'customShowPic', 'customDescription', 'customBarcode'],
        include: [{
          model: ctx.model.GoodsTaobao,
          as: 'goodsTaobao',
          attributes: ['picUrl', 'title', 'price', 'barCode', 'skus', 'propImgs', 'buyShow']
        }]
      };
      const goods = await service.goods.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
      return goods.map(this.dealSku);
    }
  }

  dealSku(good) {
    const {goodsTaobao, ...rest} = good;
    let {skus, propImgs, ...taobao} = goodsTaobao;
    let skusMapKeys = [];
    let skusMapValues = {};
    let propImgMap = new Map();
    propImgs = JSON.parse(propImgs);
    skus = JSON.parse(skus);
    if (propImgs.length) {
      propImgs.map(img => {
        const {properties, url} = img;
        propImgMap.set(properties, url);
      });
    }
    let obj = {};
    skus.map(sku => {
      const {properties, properties_name, price, barcode, quantity, sku_id} = sku;
      skusMapKeys.push({skuId: sku_id, propPath: properties});
      // skusMapValues.push({[sku_id]: {quantity, price}});
      skusMapValues[sku_id] = {quantity, price, barcode};
      // 1627207:3232481:颜色分类:巧克力色;122216343:3339140:参考身高:90cm
      properties_name.split(';').map(name => {
        const [key1, key2, value1, value2] = name.split(':');
        const imgUrl = propImgMap.get(key1 + ':' + key2);
        if (!obj[key1]) {
          obj[key1] = {
            propId: key1,
            propName: value1,
            values: {}
          };
        }
        if (!obj[key1].values[key2]) {
          let params = {valueId: key2, name: value2};
          if (imgUrl) params.imgUrl = imgUrl;
          obj[key1].values[key2] = params;
        }
      });
    });
    if (obj.values) {
      obj.values = Object.values(obj.values);
    }
    let skuProps = Object.values(obj);
    return {
      skuProps,
      skusMapValues,
      skusMapKeys,
      ...rest,
      ...taobao
    };
  }

  async getActivityAward({activityOuterId}) {
    const {service} = this;
    let result = '';
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const awards = await service.lotteryAward.findAll({where: {activityId}});
      if (awards.length) {
        result = awards[0].awardLink;
      }
    }
    return result;
  }
}

module.exports = GoodsController;
