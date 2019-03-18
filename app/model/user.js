'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const User = app.model.define('table01_cloud_user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tbUid: {
      type: STRING,
      field: 'tb_uid'
    },
    userId: {
      type: STRING,
      field: 'user_id'
    },
    tbNick: {
      type: STRING,
      field: 'tb_nick'
    },
    topSession: {
      type: STRING,
      field: 'top_session'
    },
    lastName: {
      type: STRING,
      field: 'last_name'
    },
    timeout: {
      type: STRING,
      field: 'timeout',
    },
  }, {
    tableName: 'table01_cloud_user',
    paranoid: true,
    timestamps: true
  });

  return User;
};
