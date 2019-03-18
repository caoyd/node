const {Controller} = require('egg');

/**
 * 前端路由控制
 */
class SkinController extends Controller {

  async getReport() {
    const {ctx, service} = this;
    const {userId, mixNick, token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (activity && userId) {
      const {activityId} = activity;
      ctx.body = await service.skin.getReport({activityId, userId, mixNick});
    } else {
      ctx.body = ctx.error({code: '999', msg: 'INVALID_PARAMS'});
    }
  }

  async saveReport() {
    const {ctx, service} = this;
    let {data, token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    if (!activity) {
      ctx.body = ctx.error({code: 2222, msg: 'INVALID_PARAMS'});
      return;
    }
    if (activity) {
      const {activityId} = activity;
      const {avgVulue, userScores, userDescription, userId, userAge, userSex, recommends} = data;
      const skin_detection = {
        'moisture': {
          'industry_average': avgVulue.Hydration,
          'current_customer': userScores.Hydration,
          'detection_result': userDescription.Hydration,
          'detection_description': userDescription.Hydration
        },
        'sebum': {
          'industry_average': avgVulue.Sebum,
          'current_customer': userScores.Sebum,
          'detection_result': userDescription.Sebum,
          'detection_description': userDescription.Sebum
        },
        'pore': {
          'industry_average': avgVulue.Pore,
          'current_customer': userScores.Pore,
          'detection_result': userDescription.Pore,
          'detection_description': userDescription.Pore
        },
        'melanin': {
          'industry_average': avgVulue.Melanin,
          'current_customer': userScores.Melanin,
          'detection_result': userDescription.Melanin,
          'detection_description': userDescription.Melanin
        },
        'wrinkle': {
          'industry_average': avgVulue.Wrinkle,
          'current_customer': userScores.Wrinkle,
          'detection_result': userDescription.Wrinkle,
          'detection_description': userDescription.Wrinkle
        },
        'acne': {
          'industry_average': avgVulue.Acne,
          'current_customer': userScores.Acne,
          'detection_result': userDescription.Acne,
          'detection_description': userDescription.Acne
        }
      };
      // todo 数据回流
      let array = [];
      recommends.forEach(recommend => array.concat(recommend.items));
      const recommendString = [...new Set(array)].join(',');
      const result = await service.skin.create({
        activityId,
        data: JSON.stringify(data),
        userId,
        userAge,
        userSex,
        recommends: recommendString,
        ...userScores
      });
      ctx.body = ctx.wrapper({success: !!result});
    }
  }

  async checkIsMember() {
    const {ctx, service} = this;
    const {mixNick, token: activityOuterId} = ctx.query;
    const activity = await service.activity.findOne({where: {activityOuterId}});
    const {userId} = activity;
    const user = await service.user.findUser({userId});
    const {topSession} = user;
    const result = await service.top.isBrandMember({mix_nick: mixNick, session: topSession});
    console.log(result);
    const {short_url} = await service.top.brandMemberUrl({device_code: activity.device_id});
    ctx.body = ctx.wrapper({result, url: short_url});
  }
}

module.exports = SkinController;
