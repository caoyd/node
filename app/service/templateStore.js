const baseService = require('./baseService');

class CloudTemplateStoreService extends baseService {

  constructor(ctx) {
    super(ctx, ctx.model.TemplateStore);
  }

  findTemplate({templateId}) {
    const row = {
      where: {templateId}
    };
    return this.findOne(row);
  }

  async findAllTemplate(fields = 'id,href,title,type,description,background') {
    const {ctx} = this;
    const row = {
      attributes: fields.split(',')
    };
    const list = await this.findAll(row);
    return ctx.wrapper({list});
  }

}

module.exports = CloudTemplateStoreService;
