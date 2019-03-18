/**
 * Created by Administrator on 2017/11/8.
 */

module.exports = (app) => {
  return async function oauth(ctx, next) {
    // ctx.session.userId = '2bca323d324596b34f2b33aa8fc7ed2b';
    const {userId} = ctx.session;
    if (userId === '2bca323d324596b34f2b33aa8fc7ed2b') {
      await next();
    } else {
      ctx.body = ctx.error({code: '403', msg: 'NO_PERMISSION'});
    }
  };
};



