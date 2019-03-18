const {Controller} = require('egg');

class DeviceController extends Controller {

  async deviceStatus() {
    const {ctx, service} = this;
    const {token: activityOuterId, status} = ctx.request.body;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity && status) {
      const {deviceId: device_code} = activity;
      const status_time = ctx.getNowFormatDate();
      const params = {
        device_code, status, status_time
      };
      await service.top.taobaoSmartstoreDeviceStatusFeedback({params});
      ctx.body = ctx.wrapper({result: true});
    } else {
      ctx.body = ctx.error({msg: 'INVALID_PARAMS', code: '2312'});

    }
  }

  async deviceIashelf() {
    const {ctx, service} = this;
    const {token: activityOuterId, action, itemId, couponId} = ctx.request.body;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {deviceId: device_code} = activity;
      const op_time = ctx.getNowFormatDate();
      let params = {
        device_code,
        op_time,
        action
      };
      if (itemId) {
        params.item_id = itemId;
      } else if (couponId) {
        params.coupon_id = couponId;
      } else {
        ctx.body = ctx.error({code: '2312', msg: 'MISSING_PARAMS'});
        return;
      }
      await service.top.taobaoSmartstoreDeviceIashelfFeedback({params});
    }
    ctx.body = ctx.wrapper({result: true});
  }

  async skinDeviceDetectorFeedback() {
    const {ctx, service} = this;
    const {token: activityOuterId, action, item_id, skin_detection} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity) {
      const {deviceId: device_code} = activity;
      const op_time = ctx.getNowFormatDate();

      let params = {
        device_code,
        op_time,
        action,
      };
      if (action === 'ITEM_CLICK') {
        params.item_id = item_id;
      }
      if (action === 'SKIN_DETECTION_CLICK') {
        params.skin_detection = skin_detection;
      }
      const result = await service.top.detectorReport({params});
      ctx.body = ctx.wrapper({result: !!result, topResult: result});
    }
  }

}

module.exports = DeviceController;
