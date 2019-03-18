'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotUser = app.model.define('iot_user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: STRING,
      field: 'user_id'
    },
    requestId: {
      type: STRING,
      field: 'request_id'
    },
    tenantId: {
      type: INTEGER,
      field: 'tenant_id'
    },
    appId: {
      type: STRING,
      field: 'app_id'
    },
    shopId: {
      type: STRING,
      field: 'shop_id'
    },
    appName: {
      type: STRING,
      field: 'name'
    },
    appType: {
      type: STRING,
      field: 'app_type'
    },
    type: {
      type: STRING,
      field: 'type'
    },
    appColor: {
      type: STRING,
      field: 'app_color'

    },
    appBack: {
      type: STRING,
      field: 'app_back'
    },
    appWelcome: {
      type: STRING,
      field: 'app_welcome'
    }
  }, {
    tableName: 'iot_user',
    paranoid: true,
    timestamps: true
  });

  return IotUser;
};
