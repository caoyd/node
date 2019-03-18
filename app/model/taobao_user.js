'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const cloudTaobaoUser = app.model.define('table03_cloud_taobao_user', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    telephone: STRING,
  }, {
    tableName: 'table03_cloud_taobao_user',
    paranoid: true,
    timestamps: true
  });

  return cloudTaobaoUser;
};
