const {Service} = require('egg');
const TopClient = require('../lib/top').ApiClient;
const appkey = '25018990';
const appsecret = '220d9aa564fb927514ce81daf06ae87a';

class TopService extends Service {
  async request({api, params}) {
    const client = new TopClient({
      'appkey': appkey,
      'appsecret': appsecret,
      'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });
    const {userId} = this.ctx.session;
    const tbUser = await this.ctx.service.user.findOne({where: {userId}});
    return new Promise((resolve, reject) => {
      if (tbUser) {
        const session = tbUser.topSession;
        client.execute(api, {...params, session}, (error, response) => {
          console.log(error, response);
          if (!error) return resolve(response);
          else return reject(error);
        });
      } else {
        reject({code: 12, msg: 'NOT_CONNECT_TAOBAO', notice: '未关联淘宝账号'});
      }
    });
  }

  async requestNoSession({api, params}) {
    const client = new TopClient({
      'appkey': appkey,
      'appsecret': appsecret,
      'REST_URL': 'http://gw.api.taobao.com/router/rest'
    });
    return new Promise((resolve, reject) => {
      client.execute(api, {...params}, (error, response) => {
        console.log(error, response);
        if (!error) return resolve(response);
        else return reject(error);
      });
    });
  }

  getBuyshowShow({numIid, pageNo = 1, pageSize = 4}) {
    const api = 'taobao.buyshow.show.getbyitem';
    const params = {
      item_id: numIid,
      page: pageNo,
      page_size: pageSize
    };
    return this.request({api, params});
  }

  getOnsaleList({fields = 'num_iid,title,price,cid,pic_url,item_promo_price', orderBy = 'list_time:desc', cid = 0, q = '', page_size = 100, page_no = 1}) {
    const api = 'taobao.items.onsale.get';
    const params = {
      'fields': fields,
      'q': q,
      'cid': cid,
      'order_by': orderBy,
      'page_no': page_no,
      'page_size': page_size,
    };
    return this.request({api, params});
  };

  async taobaoItemsSellerListGet({fields, numiids}) {
    const api = 'taobao.items.seller.list.get';
    const params = {
      fields,
      num_iids: numiids
    };
    return this.request({api, params});
  }

  taobaoSmartstoreDeviceStatusFeedback({params}) {
    const api = 'taobao.smartstore.device.status.feedback';
    return this.requestNoSession({api, params});
  }

  taobaoSmartstoreDeviceIashelfFeedback({params}) {
    const api = 'taobao.smartstore.device.iashelf.feedback';
    return this.requestNoSession({api, params});
  }

  brandMemberUrl({device_code, callback_url, session}) {
    // http://open.taobao.com/api.htm?docId=39398&docType=2
    const api = 'tmall.device.brand.memberurl.get';
    const params = {device_code, callback_url, session};
    return this.requestNoSession({api, params});
  }

  storeMemberUrl({device_code, store_id, report_id, session}) {
    // http://open.taobao.com/api.htm?docId=39401&docType=2
    const api = 'tmall.device.store.memberurl.get';
    const params = {device_code, store_id, report_id, session};
    return this.requestNoSession({api, params});
  }

  discountPrice(params) {
    // http://open.taobao.com/api.htm?spm=0.0.0.0.VDmF55&docId=38219&docType=2
    const api = 'tmall.popupstore.item.discount.price';
    return this.request({api, params});
  }

  traderatesGet({num_iid, page_size = 50, page_no = 1}) {
    const api = 'taobao.traderates.get';
    const rate_type = 'get';
    const role = 'buyer';
    const result = 'good';
    const fields = 'role,nick,result,created,rated_nick,item_title,content';
    const params = {
      rate_type,
      role,
      result,
      num_iid,
      page_no,
      page_size,
      fields
    };
    return this.request({api, params});
  }

  contentSave({device_code, report_url, report_card_img}) {
    const api = 'tmall.device.content.save';
    const params = {device_code, report_url, report_card_img};
    return this.request({api, params});
  }

  /**
   * 皮肤检测仪数据回流
   */
  detectorReport(params) {
    // http://open.taobao.com/api.htm?docId=39446&docType=2&scopeId=13153
    const api = 'taobao.smartstore.device.detector.feedback';
    return this.requestNoSession({api, params});
  }

  isBrandMember({mix_nick, session}) {
    const api = 'tmall.device.member.identity.get';
    const params = {
      mix_nick,
      session
    };
    return this.requestNoSession({api, params});
  }

  getPopstoreQr({device_code, target_type = 'item', item_id, redirect_url}) {
    // http://open.taobao.com/api.htm?docId=34296&docType=2
    const api = 'taobao.popstore.qrcode.get';
    const params = {
      device_code,
      target_type
    };
    if (target_type === 'item') {
      params.item_id = item_id;
    }
    if (target_type === 'activity') {
      params.redirect_url = redirect_url;
    }
    return this.requestNoSession({api, params});
  }

  
  getAvatar(nick) {
    const api = 'taobao.user.avatar.get';
    const params = {
      nick
    };
    return this.requestNoSession({api, params});
  }

}

module.exports = TopService;
