const {Controller} = require('egg');

class GoodsController extends Controller {

  async deleteGoods() {
    const {ctx, service} = this;
    const {activityId, goodsTaobaoId} = ctx.request.body;
    ctx.body = await service.goods.deleteGoods({activityId, goodsTaobaoId});
  }

  async listGoods() {
    const {ctx, service} = this;
    const {activityId, pageSize = 10, pageNumber = 1} = ctx.query;
    ctx.body = await service.goods.findGoodsList({activityId, pageSize, pageNumber});
  }

  async saveGoods() {
    const {ctx, service} = this;
    const {
      activityId,
      goodsTaobaoId,
      customBarcode,
      customShowPic,
      customDescription,
      customPicUrl,
      customPrice,
      customTitle,
      customCid
    } = ctx.request.body;

    ctx.body = await service.goods.saveGoods({
      activityId,
      goodsTaobaoId,
      customBarcode,
      customShowPic,
      customDescription,
      customPicUrl,
      customPrice,
      customTitle,
      customCid
    });
  }


  async synchronizationTaobaoData() {
    const {ctx, service} = this;
    const {activityId} = ctx.query;
    let goods = await service.goods.findAll({
      where: {activityId},
      attributes: ['goodsTaobaoId']
    });

    if (goods) {
      goods = goods.map(g => g.goodsTaobaoId);
      const goodsTaobao = await service.goodsTaobao.findAll({
        where: {activityId},
        attributes: ['numIid']
      }).then(d => {
        if (d.length) return d.map(i => i.numIid);
        else return d;
      });
      let difference = goodsTaobao.filter(x => !goods.includes(x));

      const array = ctx.sliceArray(goods);
      const fields = 'num_iid,title,pic_url,sku,price,barcode,prop_img,item_img,sold_quantity';

      let discountPricePromise = [];
      const promises = array.map(arr => {
        const numiids = arr.join(',');
        discountPricePromise.push(service.top.discountPrice({item_ids: numiids}).then(data => {
        let result = {};
        if (!data.result_dto.result_list) {
          return result;
        }
        let discount = JSON.parse(data.result_dto.result_list.replace(/\d+:\[/ig, (str) => {
          str = str.slice(0, -2);
          return `"${str}":[`;
        }));
        for (let index in discount) {
          if (discount.hasOwnProperty(index)) {
            let temp = discount[index];
            if (temp.length > 0) {
              temp = temp.sort((a, b) => a.discountPrice - b.discountPrice);
              result[index] = temp[0].discountPrice;
            }
          }
        }
        return result;
      }));
        return service.top.taobaoItemsSellerListGet({fields, numiids});
      });

      let result = [];
      let discountPrice = {};
      for (let i = 0; i < promises.length; i++) {
        let data = await promises[i];
        let discountData = await discountPricePromise[i];
        discountPrice = {...discountPrice, ...discountData};
        result.push(data);
      }

      const buyShowMap = new Map();
      for (let i = 0, length = goods.length; i < length; i++) {
        const numIid = goods[i];
        // const data = await service.top.getBuyshowShow({numIid});
        const data = await service.top.traderatesGet({num_iid: numIid});
        // const buyshow = data.traderates_get_response.trade_rates.trade_rate || [];
        // const buyshow = data.result.module.list.buyshow || [];
        let buyshow = [];
        if (data.trade_rates && data.trade_rates.trade_rate.length) {
          buyshow = data.trade_rates.trade_rate.map(item => {
            return {
              content: item.content,
              nick: item.nick
            };
          });
        }
        buyShowMap.set(numIid, buyshow);
      }
      const saveOrUpdatePromise = result.map(re => {
        return re.items.item.map(i => {
          const {num_iid, pic_url, price, title, barcode, skus, prop_imgs, item_imgs, sold_quantity} = i;
          let skuArray = [];
          let propImgs = [];
          if (prop_imgs) {
            propImgs = prop_imgs.prop_img.map(i => {
              const {properties, url} = i;
              return {properties, url};
            });
          }
          if (skus) {
            skuArray = skus.sku.map(s => {
              const {properties, properties_name, price, barcode, quantity, sku_id} = s;
              return {
                properties, properties_name, price, barcode, quantity, sku_id
              };
            });
          }
          const where = {activityId, numIid: num_iid};
          const params = {
            picUrl: pic_url,
            barcode,
            price: discountPrice[num_iid] || price,
            title,
            skus: JSON.stringify(skuArray),
            propImgs: JSON.stringify(propImgs),
            soldQuantity: sold_quantity,
            buyShow: JSON.stringify(buyShowMap.get(String(num_iid)))
          };
          return service.goodsTaobao.updateOrCreate({
            where, params
          });
        });
      });
      await Promise.all(saveOrUpdatePromise);
      if (difference.length) {
        const row = {
          where: {
            activityId,
            numIid: {
              $or: difference
            }
          },
          force: true
        };
        await service.goodsTaobao.delete(row);
      }
      ctx.body = ctx.wrapper({result: true});
    }
  }

}

module.exports = GoodsController;
