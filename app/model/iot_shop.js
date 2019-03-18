'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotShop = app.model.define('iot_shop', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    tenantId: {
      type: STRING,
      field: 'tenant_id'
    },
    shopId: {
      type: STRING,
      field: 'shop_id'
    },
    shopName: {
      type: STRING,
      field: 'shop_name'
    },
    shopAddress: {
      type: STRING,
      field: 'shop_address'
    }
  }, {
    tableName: 'iot_shop',
    paranoid: true,
    timestamps: true
  });
  return IotShop;
};
