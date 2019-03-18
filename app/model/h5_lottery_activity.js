'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const H5LotteryActivity = app.model.define('h5_lottery_activity', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    activity: STRING,
    dailyCount: {
      type: INTEGER,
      field: 'daily_count'
    },
    totalCount: {
      type: INTEGER,
      field: 'total_count'
    },
    algorithm: STRING,
    startTime: {
      type: DATE,
      field: 'start_time'
    },
    endTime: {
      type: DATE,
      field: 'end_time'
    }
  }, {
    tableName: 'h5_lottery_activity',
    paranoid: true,
    timestamps: true
  });

  return H5LotteryActivity;
};
