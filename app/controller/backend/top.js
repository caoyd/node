const {Controller} = require('egg');

/**
 * 前端路由控制
 */
class TopController extends Controller {

  async getOnsaleList() {
    const {ctx, service} = this;
    const {page_size, page_no, q} = ctx.query;
    let result = {};
    if (parseInt(q)) {
      // 纯数字
      result = await service.top.taobaoItemsSellerListGet({
        fields: 'num_iid,title,price,cid,pic_url,item_promo_price',
        numiids: parseInt(q)
      });
    } else {
      result = await service.top.getOnsaleList({page_size, page_no, q});
    }
    const list = result.items ? result.items.item : [];
    const total = result.total_results;
    ctx.body = ctx.wrapper({list, total});
  }
}

module.exports = TopController;
