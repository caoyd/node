/**
 * Created by Administrator on 2017/11/8.
 */

module.exports = (app) => {
  return async function oauth(ctx, next) {
    const {iotUserId} = ctx.session;
    const dev = false;
    if (!dev && !iotUserId) {
      ctx.body = 'invalid_params';
      return;
    }

    if (dev && !iotUserId) {
      ctx.session.iotUserId = 'dev';
    }
    await next();

  };
};



