'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const cloudLotteryLog = app.model.define('table05_cloud_lottery_log', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    awardId: {
      type: STRING,
      field: 'award_id'
    },
    user: STRING
  }, {
    tableName: 'table05_cloud_lottery_log',
    paranoid: true,
    timestamps: true
  });

  return cloudLotteryLog;
};
