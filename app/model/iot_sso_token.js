'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotSSOToken = app.model.define('iot_sso_token', {
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
    token: STRING,
    tenantId: {
      type: INTEGER,
      field: 'tenant_id'
    },
    tenantSubUserId: {
      type: STRING,
      field: 'tenant_sub_user_id'
    },
    appId: {
      type: STRING,
      field: 'app_id'
    },
    type: STRING
  }, {
    tableName: 'iot_sso_token',
    paranoid: true,
    timestamps: true
  });

  return IotSSOToken;
};
