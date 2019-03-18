const {Controller} = require('egg');
class VolvoDataController extends Controller {
  async getGameResultInfo() {
    const {ctx, service} = this;
    const data = await service.volvo.getGameData();
    ctx.body = ctx.wrapper(data);
  }

  async getCarSelectedInfo() {
    const {ctx, service} = this;
    const list = await service.volvo.getCarSelectedInfo();
    ctx.body = ctx.wrapper({list});
  }

  async getActionInfo() {
    const {ctx, service} = this;
    const list = await service.volvo.getActionList();
    ctx.body = ctx.wrapper({list});
  }

  async getAllAward() {
    const {ctx, service} = this;
    const {type} = ctx.query;
    const list = await service.volvo.getAllAward(type);
    ctx.body = ctx.wrapper({list});
  }
	
	async getGameRank() {
		const {ctx, service} = this;
		const {pageSize, pageNo} = ctx.query;
		const {list, count} = await service.volvo.getGameRankBackend({pageSize, pageNo});
		ctx.body = ctx.wrapper({list: list, total: count});
	}

  async getPrizeUserList() {
    const {ctx, service} = this;
    const {pageSize, pageNo} = ctx.query;
    const {rows, count} = await service.volvo.getPrizeUserList({pageSize, pageNo});
    ctx.body = ctx.wrapper({list: rows, total: count});
  }

  async getRestPrize() {
    const {ctx, service} = this;
    let allPrize = await service.volvo.restPrize().then(d => JSON.parse(JSON.stringify(d)));
    allPrize = allPrize.map(item => {
      const restTotal = item.count - item.count_extract;
      return {
        award_code: item.award_code,
        restTotal,
      };
    })
    ctx.body = ctx.wrapper({restList: allPrize});
  }

  async getFlowData() {
    const {ctx, service} = this;
    const data = await service.seo.getData();
    const dataTotal = await service.volvo.stayData();
    ctx.body = ctx.wrapper({pv: data.pv, uv: data.uv, address: dataTotal});
  }

  async downLoadAllLotteryUser() {
    const {ctx, service} = this;
    const data = await service.volvo.getAllLotteryUser();

    ctx.body = ctx.wrapper(data);
  }

  async downLoadEntityLotteryUser() {
    const {ctx, service} = this;
    const data = await service.volvo.getEntityLotteryUser();
    ctx.body = ctx.wrapper(data);
  }
}


module.exports = VolvoDataController;
