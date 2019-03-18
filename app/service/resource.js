const baseService = require('./baseService');

class ResourceService extends baseService {

  constructor(ctx) {
    super(ctx, ctx.model.Resource);
  }
}

module.exports = ResourceService;
