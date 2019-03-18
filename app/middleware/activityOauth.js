/**
 * Created by Administrator on 2017/11/8.
 */

module.exports = (app) => {
  return async function activityOauth(ctx, next) {
    // const level = ctx.session.level || 0;
    const {userId} = ctx.session;
    let {activityId} = ctx.query;
    if (!activityId) {
      activityId = ctx.request.body.activityId;
    }
    if (activityId) {
      const row = {
        where: {
          activityId,
          userId
        }
      };
      const isBelongUser = await ctx.service.activity.findOne(row).then(d => !!d);
      if (isBelongUser) {
        await next();
      } else {
        ctx.body = ctx.error({code: '1234', msg: 'INVALID_ACTIVITY_ID'});
      }
    } else {
      ctx.body = ctx.error({code: '1235', msg: 'MISSING_ACTIVITY_ID'});
    }
  };
};



