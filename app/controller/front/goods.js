const {Controller} = require('egg');


class GoodsController extends Controller {

  async getAllGoodsNoSku() {
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const _row = {
        attributes: [
          'customPicUrl',
          'customPrice',
          'customShowPic',
          'customTitle',
          'goodsTaobaoId'],
        where: {activityId},
        include: [
          {
            model: ctx.model.GoodsTaobao,
            where: {activityId},
            as: 'goodsTaobao',
            required: false,
            attributes: ['picUrl', 'title', 'price', 'barCode']
          },
        ]
      };
      const {rows, count} = await service.goods.findAndCountAll(_row).then(d => JSON.parse(JSON.stringify(d)));
      const list = rows.map(row => {
        const {goodsTaobao, ...rest} = row;
        return {
          ...rest,
          ...goodsTaobao
        };
      });
      ctx.body = ctx.wrapper({list, total: count});
    }
  }

  async getAllGoodsContainSkuAndBuyshow() {
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {activityId},
        attributes: ['goodsTaobaoId', 'customTitle', 'customPrice', 'customPicUrl', 'customShowPic', 'customDescription', 'customBarcode'],
        include: [{
          model: ctx.model.GoodsTaobao,
          where: {activityId},
          as: 'goodsTaobao',
          required: false,
          attributes: ['picUrl', 'title', 'price', 'barCode', 'skus', 'propImgs', 'buyShow']
        }]
      };
      const goods = await service.goods.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
      const list = goods.map(this.dealSku);
      ctx.body = ctx.wrapper({list});
    }
  }

  async getGoodsInCategoryNoSkuWith1() {
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {activityId},
        attributes: ['goodsTaobaoId', 'customTitle', 'customCid', 'customPrice', 'customPicUrl', 'customShowPic', 'customDescription'],
        include: [{
          model: ctx.model.CloudGoodsTaobao,
          where: {activityId},
          as: 'goodsTaobao',
          required: false,
          attributes: ['picUrl', 'title', 'price', 'buyShow', 'soldQuantity']
        }]
      };
      const goods = await service.goods.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
      const category = await service.category.findAll({where: {activityId}}).then(d => JSON.parse(JSON.stringify(d)));
      let goodsMap = new Map();
      goods.map(i => {
        const {goodsTaobao, customCid, ...rest} = i;
        goodsMap.set(customCid, {
          ...rest,
          ...goodsTaobao
        });
      });
      const treeNode = category.map(obj => {
        const g = goodsMap.get(String(obj.cid));
        return {...obj, goods: g};
      });
      const list = ctx.convert(treeNode);
      ctx.body = ctx.wrapper({list});
    }
  }

  async getGoodsInCategoryNoSkuWithN() {
    // const {token = '6f9f59c06b407223b14f461813c847b9'} = ctx.query;
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {activityId},
        attributes: ['goodsTaobaoId', 'customTitle', 'customCid', 'customPrice', 'customPicUrl', 'customShowPic', 'customDescription'],
        include: [{
          model: ctx.model.GoodsTaobao,
          where: {activityId},
          as: 'goodsTaobao',
          required: false,
          attributes: ['picUrl', 'title', 'price', 'buyShow', 'soldQuantity']
        }]
      };
      const goods = await service.goods.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
      const category = await service.category.findAll({where: {activityId}}).then(d => JSON.parse(JSON.stringify(d)));
      let treeNode = new Map();
      category.map(obj => {
        treeNode.set(String(obj.cid), {...obj, goods: []});
      });
      goods.map(i => {
        const {goodsTaobao, customCid, ...rest} = i;
        const arr = customCid.split(',');
        arr.map(cid => {
          let g = treeNode.get(cid);
          if (g) {
            g.goods.push({
              ...rest,
              ...goodsTaobao
            });
            treeNode.set(cid, g);
          }
        });
      });
      const list = ctx.convert([...treeNode.values()]);
      ctx.body = ctx.wrapper({list});
    }

  }
  async getGoodsInCategoryContainSkuWithN() {
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {activityId},
        attributes: ['goodsTaobaoId', 'customTitle', 'customCid', 'customPrice', 'customPicUrl', 'customShowPic', 'customDescription'],
        include: [{
          where: {activityId},
          model: ctx.model.GoodsTaobao,
          as: 'goodsTaobao',
          required: false,
          attributes: ['picUrl', 'title', 'price', 'buyShow', 'soldQuantity', 'skus', 'propImgs']
        }]
      };
      const goods = await service.goods.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
      const category = await service.category.findAll({where: {activityId}}).then(d => JSON.parse(JSON.stringify(d)));
      let treeNode = new Map();
      category.map(obj => {
        treeNode.set(String(obj.cid), {...obj, goods: []});
      });
      goods.map(i => {
        const {goodsTaobao, customCid, ...rest} = i;
        const data = this.dealSku(goodsTaobao);
        const arr = customCid.split(',');
        arr.map(cid => {
          let g = treeNode.get(cid);
          if (g) {
            g.goods.push({
              ...rest,
              ...data
            });
            treeNode.set(cid, g);
          }
        });
      });
      const list = ctx.convert([...treeNode.values()]);
      ctx.body = ctx.wrapper({list});
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

  async getSkinShop() {
    // const {token = '6f9f59c06b407223b14f461813c847b9'} = ctx.query;
    const {ctx, service} = this;
    const {token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {activityId} = activity;
      const row = {
        where: {activityId},
        attributes: ['goodsTaobaoId', 'customTitle', 'customCid', 'customPrice', 'customPicUrl', 'customShowPic'],
        include: [{
          model: ctx.model.GoodsTaobao,
          where: {activityId},
          as: 'goodsTaobao',
          required: false,
          attributes: ['picUrl', 'title', 'price', 'soldQuantity']
        }]
      };
      const goods = await service.goods.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
      const category = await service.category.findAll({where: {activityId}}).then(d => JSON.parse(JSON.stringify(d)));
      let treeNode = new Map();
      category.map(obj => {
        treeNode.set(String(obj.cid), {...obj, items: []});
      });
      goods.map(i => {
        const {goodsTaobao, customCid, ...rest} = i;
        const arr = customCid.split(',');
        arr.map(cid => {
          let g = treeNode.get(cid);
          if (g) {
            g.items.push({
              num_iid: rest.goodsTaobaoId,
              pic_url: rest.customPicUrl || goodsTaobao.picUrl,
              price: rest.customPrice || goodsTaobao.price,
              title: rest.customTitle || goodsTaobao.title,
              sold_quantity: goodsTaobao.soldQuantity
            });
            treeNode.set(cid, g);
          }
        });
      });
      let list = ctx.convertSkin([...treeNode.values()]);
      // console.timeEnd();
      list = list.map(item => {
        const {name: type, ...rest} = item;
        return {type, ...rest};
      });
      ctx.body = ctx.wrapper({list});
    }
  }


}

module.exports = GoodsController;
