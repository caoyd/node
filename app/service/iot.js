const {Service} = require('egg');
const Sequelize = require('sequelize');
const uuidv1 = require('uuid/v1');
const crypto = require('crypto');
const {Constants, HttpHeader, SystemHeader} = require('../lib/iot/Constants');
const hmacSign = (secret, content, type = 'md5', encoding = 'hex') => crypto.createHmac(type, secret).update(content).digest(encoding);
const {Op} = Sequelize;

const type = {
  showPhoto: 'image',
  video: 'video'
};

class IotService extends Service {

  constructor(ctx) {
    super(ctx);
    this._model = {
      USER: ctx.model.IotUser,
      TOKEN: ctx.model.IotSsoToken,
      SIGN_ERROR: ctx.model.IotSignError,
      GOODS_COMMON: ctx.model.IotGoodsCommon,
      GOODS_APP: ctx.model.IotGoodsApp,
      SHOP: ctx.model.IotShop,
      GOODS_CLASS: ctx.model.IotGoodsClass,
      RESOURCE: ctx.model.IotResource,
      OPERATION_LOG: ctx.model.IotOperationLog,
      FACE_COMMON: ctx.model.IotFaceCommon,
    };
  }

  /** api for iot **/
  async createInstance({requestId, tenantId, appId, appType, type}) {
    let userId = uuidv1().toString().replace(/-/g, '');
    return this._model.USER.create({requestId, userId, tenantId, appId, appType, type});
  }

  async deleteInstance({requestId, tenantId, userId, appId, type}) {
    const row = {
      where: {
        tenantId,
        userId,
        appId,
        type
      }
    };
    return this._model.USER.destroy(row);
  }

  async getSSOUrl({requestId, tenantId, tenantSubUserId, appId, userId, type}) {
    const user = await this.checkUser({tenantId, appId, userId, type});
    if (user) {
      const timestamp = +new Date();
      const token = this.createToken({requestId, type, timestamp});
      await this._model.TOKEN.create({token, requestId, tenantId, tenantSubUserId, appId, userId, type});
      return `${this.app.config.iot.redirectUrl}?token=${token}&timestamp=${timestamp}`;
    } else {
      throw 'user_not_exist';
    }
  }

  createToken({requestId, type, timestamp}) {
    const content = `requestId${requestId}type${type}timestamp${timestamp}`;
    console.log(this.ctx.app.config.iot[type].appSecret);
    return hmacSign(this.ctx.app.config.iot[type].appSecret, content);
  }

  async getTokenInfo({token, timestamp}) {
    const info = await this._model.TOKEN.findOne({where: {token}});
    const {requestId, type} = info;
    const _token = this.createToken({requestId, type, timestamp});
    if (token !== _token) {
      throw 'token_is_error';
    }
    if (+new Date() - timestamp > 15 * 60 * 1000) {
      throw 'token_is_expire';
    }
    return info;
  }

  async updateUser(params, where) {
    return this._model.USER.update(params, {where});
  }

  async checkUser({tenantId, appId, userId, type}) {
    const row = {
      where: {
        tenantId,
        appId,
        userId,
        type
      }
    };
    return this._model.USER.findOne(row);
  }

  async checkApp({tenantId, appId, type}) {
    const row = {
      where: {
        tenantId,
        appId,
        type
      }
    };
    return this._model.USER.findOne(row);
  }

  buildStringToSign(path, method, headers, querys, bodys, signHeaderPrefixList) {
    let stringToSign = '';
    stringToSign += method.toString().toUpperCase();
    stringToSign += Constants.LF;
    if (headers[HttpHeader.HTTP_HEADER_ACCEPT.toLowerCase()]) {
      stringToSign += headers[HttpHeader.HTTP_HEADER_ACCEPT.toLowerCase()];
    }
    stringToSign += Constants.LF;
    if (headers[HttpHeader.HTTP_HEADER_CONTENT_MD5.toLowerCase()]) {
      stringToSign += headers[HttpHeader.HTTP_HEADER_CONTENT_MD5.toLowerCase()];
    }
    stringToSign += Constants.LF;
    if (headers[HttpHeader.HTTP_HEADER_CONTENT_TYPE.toLowerCase()]) {
      stringToSign += headers[HttpHeader.HTTP_HEADER_CONTENT_TYPE.toLowerCase()];
    }
    stringToSign += Constants.LF;
    if (headers[HttpHeader.HTTP_HEADER_DATE.toLowerCase()]) {
      stringToSign += headers[HttpHeader.HTTP_HEADER_DATE.toLowerCase()];
    }
    stringToSign += Constants.LF;
    stringToSign += this.buildHeaders(headers, signHeaderPrefixList);
    stringToSign += this.buildResource(path, querys, bodys);
    return stringToSign;
  };

  buildHeaders(headers, signHeaderPrefixList) {
    delete headers[SystemHeader.X_CA_SIGNATURE.toLowerCase()];
    delete headers[HttpHeader.HTTP_HEADER_ACCEPT.toLowerCase()];
    delete headers[HttpHeader.HTTP_HEADER_CONTENT_MD5.toLowerCase()];
    delete headers[HttpHeader.HTTP_HEADER_CONTENT_TYPE.toLowerCase()];
    delete headers[HttpHeader.HTTP_HEADER_DATE.toLowerCase()];
    let sortedKey = Object.keys(headers).sort();
    let sb = '';
    let signHeadersStringBuilder = '';
    sortedKey.forEach((key) => {
      if (this.isHeaderToSign(key, signHeaderPrefixList)) {
        sb += key;
        sb += Constants.SPE2;
        if (headers[key].length > 0) {
          sb += headers[key];
        }
        sb += Constants.LF;
        if (0 < signHeadersStringBuilder.length) {
          signHeadersStringBuilder += Constants.SPE1;
        }
        signHeadersStringBuilder += key;
      }
      this.ctx.request.header[SystemHeader.X_CA_SIGNATURE_HEADERS] = signHeadersStringBuilder;
    });
    return sb;
  };

  buildResource(path, querys, bodys) {
    let sb = '';
    if (0 < path.length) {
      sb += path;
    }
    let sbParam = '';
    let sortParams = {};

    // body参与签名
    if (bodys) {
      sortParams = {...sortParams, ...bodys};
    }

    // query参与签名
    if (querys) {
      sortParams = {...sortParams, ...querys};
    }

    // console.log(sortParams);
    // 排序
    let sortKeys = Object.keys(sortParams).sort();
    // 参数Key
    sortKeys.forEach((key) => {
      if (key.length > 0) {
        if (sbParam.length > 0) {
          sbParam += '&';
        }
        sbParam += key;
        if (null != sortParams[key]) {
          if (0 < sortParams[key].length) {
            sbParam += `=${sortParams[key]}`;
          }
        }
      }
    });

    if (0 < sbParam.length) {
      sb += `?${sbParam}`;
    }
    return sb;
  };

  isHeaderToSign(headerName, signHeaderPrefixList) {
    if (null == headerName) {
      return false;
    }
    if (0 === headerName.length) {
      return false;
    }
    if (headerName.includes(Constants.CA_HEADER_TO_SIGN_PREFIX_SYSTEM.toLowerCase())) {
      return true;
    }
    if (signHeaderPrefixList.length === 0) {
      return false;
    }
    return signHeaderPrefixList.includes(headerName);
  };

  async checkSign(type, signHeaderPrefixList = []) {

    const {ctx, app} = this;
    const object = app.config.iot[type];
    if (!object) {
      throw 'check_sign_fail';
    }
    const path = ctx.request.path;
    const method = ctx.request.method;
    const headers = ctx.request.header;
    const querys = ctx.query;
    const bodys = ctx.request.body;
    const sign = ctx.request.header[SystemHeader.X_CA_SIGNATURE.toLowerCase()];
    const content = this.buildStringToSign(path, method, headers, querys, bodys, signHeaderPrefixList);
    const generatedSign = hmacSign(object.appSecret, content, 'sha256', 'base64');
    await this._model.SIGN_ERROR.create({content, generatedSign, sign, type});
    if (sign !== generatedSign) {
      throw 'check_sign_fail';
    }
    return true;
  };

  /** api for backend **/

  async getAppList({tenantId}) {
    const row = {
      where: {
        tenantId
      },
      attributes: ['appId', 'type', 'appName', 'appBack', 'appColor', 'appWelcome']
    };
    return await this._model.USER.findAndCountAll(row).then(d => JSON.parse(JSON.stringify(d)));
  }

  async updateApp({tenantId, appName, appId, appColor, appBack, appWelcome}) {
    const row = {
      where: {
        tenantId,
        appId
      }
    };
    const isExist = await this._model.USER.findOne(row);
    if (!isExist) return false;
    return this._model.USER.update({appName, appColor, appBack, appWelcome}, row);
  }

  async getAppInfo({tenantId, appId}) {
    const row = {
      where: {
        // tenantId,
        appId
      }
    };
    // const sql = `select a.app_color as appColor, a.app_back as appBack, a.app_welcome as appWelcome, a.app_id as appId, a.name as appName, b.shop_name as shopName from iot_user a left join iot_shop b on a.shop_id = b.shop_id where a.app_id = "${appId}" and a.deleted_at is null and b.deleted_at is null`;
    // return await this.ctx.model.query(sql, {type: Sequelize.QueryTypes.SELECT});
    return this._model.USER.findOne(row);

  }

  async getClassList({pageSize, pageNum, appId}) {
    const row = {
      where: {
        appId,
      },
      offset: pageSize * (pageNum - 1),
      limit: parseInt(pageSize),
      attributes: ['classPicUrl', 'className', 'relationNum', 'classId'],
    };
    const {rows: list, count: total} = await this._model.GOODS_CLASS.findAndCountAll(row);
    return {
      list,
      total
    }
  }

  async createClass(appId, other) {
    const isExist = await this.findOneApp(appId);
    if (!isExist) return false;

    const params = {
      appId,
      ...other,
      relationNum: 0
    };
    return this._model.GOODS_CLASS.create(params);
  }

  async updateClass(classId, other) {
    const isExist = await this.findOneClass(classId);
    if (!isExist) return false;
    return this._model.GOODS_CLASS.update(other, {where: {classId}});
  }

  async removeClass(classId) {
    const row = {
      where: {
        classId,
      }
    };
    await this._model.GOODS_APP.destroy(row);
    return this._model.GOODS_CLASS.destroy(row);
  }

  async findOneApp(appId) {
    const row = {
      where: {
        appId
      }
    };
    return await this._model.USER.findOne(row).then(d => JSON.parse(JSON.stringify(d)));
  }

  async findOneClass(classId) {
    const row = {
      where: {
        classId
      }
    };
    return this._model.GOODS_CLASS.findOne(row);
  }

  async findOneGoods(goodsId) {
    const row = {
      where: {
        goodsId
      }
    };
    return this._model.GOODS_COMMON.findOne(row);
  }

  async updateClassRelationNum(classId, relationNum) {
    const row = {
      where: {
        classId,
      }
    };
    return this._model.GOODS_CLASS.update({relationNum}, row);
  }

  async createGoods(params) {
    return this._model.GOODS_COMMON.create(params);
  }

  async getGoodsList({tenantId, pageSize = 20, pageNum = 1, keyword}) {
    const offset = pageSize * (pageNum - 1);
    const limit = parseInt(pageSize);
    const row = {
      where: {
        [Op.or]: [{
          tenantId,
          userGoodsId: {
            [Op.like]: `%${keyword}%`
          }
        }, {
          tenantId,
          title: {
            [Op.like]: `%${keyword}%`
          }
        }],
      },
      offset,
      limit
    };
    return this._model.GOODS_COMMON.findAndCountAll(row);
  }

  async updateGoods({goodsId, tenantId, ...updateGoodsInfo}) {
    const isExist = await this.findOneGoods(goodsId);
    if (!isExist) throw '商品不存在';
    const row = {
      where: {
        tenantId,
        goodsId,
      }
    };
    await this._model.GOODS_COMMON.update(updateGoodsInfo, row);
    return true;
  }

  async getGoodsListInApp({appId, pageSize, pageNum}) {
    const row = {
      where: {
        appId,
      },
      offset: pageSize * (pageNum - 1),
      limit: parseInt(pageSize),
    };
    return this._model.GOODS_APP.findAndCountAll(row);
  }

  async createGoodsInApp({tenantId, classId, goodsId, appId}) {
    const commonRow = {
      where: {
        id: goodsId,
        tenantId
      },
      attributes: ['userGoodsId', 'title', 'price', 'picUrl', 'showPic', 'desc', 'cid', 'barcode'],
    };
    let goodsCommon = await this._model.GOODS_COMMON.findOne(commonRow).then(d => JSON.parse(JSON.stringify(d)));
    if (!goodsCommon) throw '商品id不正确';
    // console.log('goodsCommon==', goodsCommon);

    const params = {
      ...goodsCommon,
      goodsCommonId: goodsId,
      appId,
      classId,
    };
    const relationNum = Sequelize.literal('relation_num + 1');
    await this.updateClassRelationNum(classId, relationNum);
    await this._model.GOODS_APP.create(params);
    return true;
  }

  async updateGoodsInApp({goodsAppId, ...updateGoodsInfo}) {
    const row = {
      where: {
        goodsAppId,
      }
    };
    return this._model.GOODS_APP.update(updateGoodsInfo, row);
  }

  async deleteGoodsInApp({goodsAppId}) {
    const row = {
      where: {
        goodsAppId
      }
    };
    const data = await this._model.GOODS_APP.findOne(row).then(d => JSON.parse(JSON.stringify(d)));
    const relationNum = Sequelize.literal('relation_num - 1');
    await this.updateClassRelationNum(data.classId, relationNum);
    return this._model.GOODS_APP.destroy(row);
  }

  async createResource({data, other}) {
    const {endDate, startDate, appId} = other;
    const infoId = this.ctx.makeNumId();
    for (let key in data) {
      const params = {
        key,
        type: type[key],
        value: data[key],
        infoId,
        endDate,
        startDate,
        appId
      };
      await this._model.RESOURCE.create(params);
    }
    return true;
  }

  async getResourceList({appId, pageSize, pageNum}) {
    const row = {
      where: {
        appId
      },
      attributes: ['appId', 'key', 'value', 'endDate', 'startDate', 'infoId'],
      offset: pageSize * 2 * (pageNum - 1),
      limit: parseInt(pageSize) * 2
    };
    const list = await this._model.RESOURCE.findAll(row).then(d => JSON.parse(JSON.stringify(d)));
    const sql = `select count(distinct info_id) as total from iot_resource where app_id = "${appId}" and deleted_at is null`;
    const [value] = await this.ctx.model.query(sql, {type: Sequelize.QueryTypes.SELECT});
    console.log(list);
    let newList = {};
    list.forEach(item => {
      const {key, value, ...other} = item;
      newList[item.infoId] = {
        ...newList[item.infoId],
        ...other,
        [key]: value
      };
      console.log(newList);
    });
    // console.log(newList);
    return {
      list: Object.values(newList),
      total: value.total,
    }

  }

  async getShopList({tenantId, pageSize, pageNum, keyword}) {
    const row = {
      where: {
        tenantId,
        shopName: {
          [Op.like]: `%${keyword}%`
        }
      },
      attributes: ['shopName', 'shopId', 'shopAddress'],
      offset: pageSize * (pageNum - 1),
      limit: parseInt(pageSize)
    };
    const {rows: list, count: total} = await this._model.SHOP.findAndCountAll(row);
    return {
      list,
      total,
    }
  }

  async getNameList(tenantId) {
    const row = {
      where: {
        tenantId,
      },
      attributes: ['shopId', 'shopName']
    };
    return this._model.SHOP.findAll(row);
  }

  async createShop({shopName, shopAddress, tenantId}) {
    const shopId = this.ctx.makeNumId();
    const params = {
      tenantId,
      shopId,
      shopName,
      shopAddress
    };
    return this._model.SHOP.create(params);
  }

  async updateShop({other, shopId, tenantId}) {
    const row = {
      where: {
        shopId,
        tenantId
      }
    };
    const isExist = await this._model.SHOP.findOne(row);
    if (!isExist) return false;
    await this._model.SHOP.update(other, row);
    return true;
  }

  async removeShop(shopId, tenantId) {
    return this._model.SHOP.destroy({where: {shopId, tenantId}});
  }

  // 人脸
  async findOneFace(faceId) {
    const row = {
      where: {faceId}
    };
    return await this._model.FACE_COMMON.findOne(row).then(d => JSON.parse(JSON.stringify(d)));
  }

  async createFace({appId, faceName, faceId, faceImage}) {
    const appIsExist = await this.findOneApp(appId);
    if (!appIsExist) throw '设备不存在';
    const faceIdIsExist = await this._model.FACE_COMMON.findOne({where: {faceId}});
    if (faceIdIsExist) throw '会员ID以存在，不能重复';
    return this._model.FACE_COMMON.create({faceImage, faceName, faceId, appId});
  }

  async getFaceList({pageSize, pageNum, keyword, appId}) {
    const row = {
      where: {appId},
      offset: pageSize * (pageNum - 1),
      limit: parseInt(pageSize)
    };
    let {rows: list, count: total} = await this._model.FACE_COMMON.findAndCountAll(row).then(d => JSON.parse(JSON.stringify(d)));
    list = list.map(i => {
      return {
        ...i,
        faceImage: `${this.config.avatarUrl}/iot/${i.appId}/${i.faceImage}`
      }
    });
    console.log(list);
    return {
      list,
      total,
    }
  }

  async removeFace(faceId) {
    return this._model.FACE_COMMON.destroy({where: {faceId}});
  }

  async updateFace({faceId, faceName}) {
    return await this._model.FACE_COMMON.update({faceName}, {where: {faceId}});
  }

  // 回流数据展示
  async getActionList({appId, pageSize, pageNum}) {
    const {appType} = await this.findOneApp(appId);
    console.log(appType);
    if (appType === 'face') {
      const faceListSql = `select a.app_id as appId, a.item_id as itemId, a.skin_detection as skinDetection, a.action, a.id, a.created_at, b.face_name as faceName, b.face_image as faceImage from iot_operation_log a left join iot_face_common b on a.item_id = b.face_id where a.app_id = "${appId}" and a.deleted_at is null`;
      let faceList = await this.ctx.model.query(faceListSql, {type: Sequelize.QueryTypes.SELECT});
      const countSql = `select count(*) as count from iot_operation_log where app_id = "${appId}" and deleted_at is null`;
      const faceCount = await this.ctx.model.query(countSql, {type: Sequelize.QueryTypes.SELECT});
      faceList = faceList.map(i => {
        const {faceImage, appId} = i;
        return {
          ...i,
          faceImage: `${this.config.avatarUrl}/iot/${appId}/${faceImage}`,
        }
      });
      return {
        list: faceList,
        count: faceCount[0].count
      }
    }
    const row = {
      where: {
        appId,
      },
      offset: pageSize * (pageNum - 1),
      limit: parseInt(pageSize)
    };
    let {rows: list, count: total} = await this._model.OPERATION_LOG.findAndCountAll(row).then(d => JSON.parse(JSON.stringify(d)));
    list = list.map(i => {
      return {
        ...i,
        skinDetection: i.skinDetection ? JSON.parse(i.skinDetection) : ''
      }
    });
    return {
      list,
      total
    }
  }

}

module.exports = IotService;
