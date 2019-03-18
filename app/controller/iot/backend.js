const {Controller} = require('egg');
const path = require('path');
const fs = require('fs');
const sendToWormhole = require('stream-wormhole');
const awaitStreamReady = require('await-stream-ready').read;

/**
 * 'skin', 肌肤检测仪
 * 'face', 人脸识别
 * 'bluetooth', 蓝牙
 * 'advertisement', 信息发布
 * 'interaction' 触摸
 */

const uplaodBasePath = 'iot/';
class BackendController extends Controller {

  /** **** user **** **/
  async getAppList() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    let {rows, count} = await service.iot.getAppList({tenantId});
    rows = rows.map(item => {
      return {
        ...item,
        appType: item.type,
      };
    });
    ctx.body = ctx.wrapper({list: rows, total: count});
  }

  async updateApp() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appName, appColor = null, appBack = null, appId, appWelcome = null} = ctx.request.body;
    const success = await service.iot.updateApp({tenantId, appName, appId, appColor, appBack, appWelcome});
    ctx.body = ctx.wrapper({success});
  }

  async createGoods() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    let {skus, ...goods} = ctx.request.body;
    skus = JSON.stringify(skus);
    const {goodsId} = await service.iot.createGoods({tenantId, ...goods, skus});
    ctx.body = ctx.wrapper({goodsId});
  }

  async deleteGoods() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {goodsId} = ctx.request.body;
    // todo check auth;
    const success = await service.iot.deleteGoods({tenantId, goodsId}).then(d => !!d);
    ctx.body = ctx.wrapper({success});
  }

  async getGoodsList() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {pageSize, pageNum, keyword} = ctx.query;
    // todo check auth;
    const {rows: list, count: total} = await service.iot.getGoodsList({tenantId, pageSize, pageNum, keyword});
    ctx.body = ctx.wrapper({list, total});
  }

  async updateGoods() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    let {goodsId, skus, ...updateGoodsInfo} = ctx.request.body;
    // todo check auth
    skus = JSON.stringify(skus);
    try {
      const success = await service.iot.updateGoods({goodsId, tenantId, skus, ...updateGoodsInfo}).then(d => !!d);
      ctx.body = ctx.wrapper({success});
    } catch (e) {
      ctx.body = ctx.error({code: 2002, msg: 'goods_error', notice: e});
    }

  }

  /** ***** app ***** **/
  async getAppInfo() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId} = ctx.query;
    const appInfo = await service.iot.getAppInfo({tenantId, appId});
    ctx.body = ctx.wrapper(appInfo);
  }

  // 人脸识别

  getStat(path) {
    return new Promise((resolve, reject) => {
      fs.stat(path, (err, stats) => {
        if(err){
          resolve(false);
        }else{
          resolve(stats);
        }
      })
    })
  }

  async createFace() {
    const {ctx, service} = this;
    // const {faceImage, faceName, faceId, appId, formData} = ctx.request.body;
    const stream = await ctx.getFileStream();
    const {appId = '1', faceId, faceName} = stream.fields;
    // 一个appId 对应一个文件夹
    const dirName = appId.toString();
    // 查看iot文件是否存在
    const iotFileIsExist = await this.getStat(path.join(this.config.baseDir, uplaodBasePath));
    if(!iotFileIsExist) fs.mkdirSync(path.join(this.config.baseDir, uplaodBasePath));
    // 查看对应的appId文件是否存在
    const fileIsExist = await this.getStat(path.join(this.config.baseDir, uplaodBasePath, dirName));
    if(!fileIsExist) fs.mkdirSync(path.join(this.config.baseDir, uplaodBasePath, dirName));
    const filename = faceId.toString() + path.extname(stream.filename);
    const target = path.join(this.config.baseDir, uplaodBasePath, dirName, filename);
    const writeStream = fs.createWriteStream(target);
    try {
      // 写入文件
      stream.pipe(writeStream);
      await service.iot.createFace({appId, faceName, faceId, faceImage: faceId.toString() + path.extname(stream.filename)});
    } catch (e) {
      // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
      await sendToWormhole(stream);
      ctx.body = ctx.error({code: 2003, msg: '', notice: e});
      return;
      // throw err;
    }
    // const success = await service.iot.createFace({faceImage: JSON.stringify(faceImage), faceName, faceId, appId});
    ctx.body = ctx.wrapper({success: true});
  }

  async getFaceList() {
    const {ctx, service} = this;
    const {pageSize = 20, pageNum = 1, keyword, appId} = ctx.query;
    const data = await service.iot.getFaceList({pageSize, pageNum, keyword, appId});
    ctx.body = ctx.wrapper(data);
  }

  async updateFace() {
    const {ctx, service} = this;
    const {faceId, faceName} = ctx.request.body;
    const [success] = await service.iot.updateFace({faceId, faceName});
    ctx.body = ctx.wrapper({success: !!success});
  }

  async removeFace() {
    const {ctx, service} = this;
    const {faceId} = ctx.request.body;
    const data = await service.iot.findOneFace(faceId);
    if (!data) ctx.body = ctx.error({code: 2000, msg: '', notice: '未找到此用户'});
    const dirName = data.appId.toString();
    const avatarPath = path.join(this.config.baseDir, uplaodBasePath, dirName, data.faceImage);
    fs.unlink(avatarPath, (err) => {
      if (err) return console.log(err);
      // console.log('文件删除成功');
    });
    await service.iot.removeFace(faceId);
    ctx.body = ctx.wrapper({success: true});
  }

  /** 分类 **/
  async getClassList() {
    const {ctx, service} = this;
    const {pageSize, pageNum, appId} = ctx.query;
    const data = await service.iot.getClassList({pageSize, pageNum, appId});
    ctx.body = ctx.wrapper(data);
  }

  async createClass() {
    const {ctx, service} = this;
    const {appId, ...other} = ctx.request.body;
    console.log(other);
    const success = await service.iot.createClass(appId, other);
    ctx.body = ctx.wrapper({success: !!success});
  }

  async updateClass() {
    const {ctx, service} = this;
    const {classId, ...other} = ctx.request.body;
    const success = await service.iot.updateClass(classId, other);
    ctx.body = ctx.wrapper({success: !!success});
  }

  async removeClass() {
    const {ctx, service} = this;
    const {classId} = ctx.request.body;
    const success = await service.iot.removeClass(classId);
    ctx.body = ctx.wrapper({success: !!success});
  }

  async addGoodsInApp() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, classId, goodsId} = ctx.request.body;

    try {
      const success = await service.iot.createGoodsInApp({tenantId, classId, goodsId: parseInt(goodsId), appId});
      ctx.body = ctx.wrapper({success});
    } catch (e) {
      ctx.body = ctx.error({code: 2001, msg: '', notice: e});

    }

  }

  async getGoodsListInApp() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, pageSize, pageNum} = ctx.query;
    const {rows: list, count: total} = await service.iot.getGoodsListInApp({appId, tenantId, pageSize, pageNum});
    ctx.body = ctx.wrapper({list, total});
  }

  async deleteGoodsInApp() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {goodsAppId} = ctx.request.body;
    // todo check auth;
    const success = await service.iot.deleteGoodsInApp({goodsAppId}).then(d => !!d);
    ctx.body = ctx.wrapper({success});
  }

  async updateGoodsInApp() {
    const {ctx, service} = this;
    const {goodsAppId, ...updateGoodsInfo} = ctx.request.body;
    // todo check auth
    const success = await service.iot.updateGoodsInApp({goodsAppId, ...updateGoodsInfo}).then(d => !!d);
    ctx.body = ctx.wrapper({success});
  }

  async createCategory() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, ...category} = ctx.request.body;
    const {categoryId} = await service.iot.createCategory({tenantId, appId, ...category});
    ctx.body = ctx.wrapper({categoryId});
  }

  async deleteCategory() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, categoryId} = ctx.request.body;
    const success = await service.iot.deleteCategory({tenantId, appId, categoryId}).then(d => !!d);
    ctx.body = ctx.wrapper({success});
  }

  async getCategoryList() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId} = ctx.query;
    const {rows: list, count: total} = await service.iot.getCategoryList({tenantId, appId});
    ctx.body = ctx.wrapper({list, total});
  }

  async updateCategory() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, categoryId} = ctx.query;
    const category = await service.iot.getCategoryList({tenantId, appId, categoryId});
    ctx.body = ctx.wrapper(category);
  }

  async getResourceList() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, pageSize = 20, pageNum = 1} = ctx.query;
    const data = await service.iot.getResourceList({appId, pageSize, pageNum});
    ctx.body = ctx.wrapper(data);
  }

  async createResource() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {data, ...other} = ctx.request.body;
    console.log(data);
    const success = await service.iot.createResource({data, other});
    ctx.body = ctx.wrapper({success});
  }

  async updateResource() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, key, value, resourceId} = ctx.request.body;
    const success = await service.iot.updateResource({appId, key, value, resourceId}).then(d => !!d);
    ctx.body = ctx.wrapper({success});
  }

  async deleteResource() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {appId, resourceId} = ctx.query;
    const success = await service.iot.deleteResource({appId, resourceId, tenantId}).then(d => !!d);
    ctx.body = ctx.wrapper({success});
  }

  async getShopList() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {pageSize = 20, pageNum = 1, keyword = ''} = ctx.query;
    console.log(pageSize);
    const data = await service.iot.getShopList({tenantId, pageSize, pageNum, keyword});
    ctx.body = ctx.wrapper(data);
  }

  async getNameList() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const list = await service.iot.getNameList(tenantId);
    ctx.body = ctx.wrapper({list});
  }

  async createShop() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {shopName, shopAddress} = ctx.request.body;
    const success = await service.iot.createShop({shopName, shopAddress, tenantId});
    ctx.body = ctx.wrapper({success});
  }

  async updateShop() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {shopId, ...other} = ctx.request.body;
    const success = await service.iot.updateShop({other, shopId, tenantId});
    ctx.body = ctx.wrapper({success});
  }

  async removeShop() {
    const {ctx, service} = this;
    const {iotUserId: tenantId} = ctx.session;
    const {shopId} = ctx.request.body;
    try {
      await service.iot.removeShop(shopId, tenantId);
      ctx.body = ctx.wrapper({success: true});
      return;
    } catch (e) {

    }
    ctx.body = ctx.wrapper({success: false});


  }

  //  展示回流数据
  async getActionList() {
    const {ctx, service} = this;
    const {appId, pageSize = 20, pageNum = 1} = ctx.query;
    const data = await service.iot.getActionList({appId, pageSize, pageNum});
    ctx.body = ctx.wrapper(data);
    // const list
  }


}

module.exports = BackendController;
