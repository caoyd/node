/**
 * Created by Administrator on 2017/11/8.
 */

module.exports = (app) => {
  return async function oauth(ctx, next) {
    const {userId} = ctx.session;
    if (userId) {
      await next();
    } else {
      const link = `https://oauth.taobao.com/authorize?response_type=code&client_id=${ctx.app.config.TBapp.AK}&redirect_uri=https://yoofun.ews.m.jaeapp.com/index.html`;
      ctx.body = await ctx.renderView('/auth', {link});
    }
  };
};



