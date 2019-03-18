'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const H5LotteryAward = app.model.define('h5_lottery_award', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activity: STRING,
    awardName: {
      type: STRING,
      field: 'award_name'
    },
    awardCode: {
      type: STRING,
      field: 'award_code'
    },
    probability: INTEGER,
    count: INTEGER,
    countExtract: {
      type: INTEGER,
      field: 'count_extract'
    },
    dailyExtract: {
      type: INTEGER,
      field: 'daily_extract'
    },
    todayExtract: {
      type: INTEGER,
      field: 'today_extract'
    }
  }, {
    tableName: 'h5_lottery_award',
    paranoid: true,
    timestamps: true
  });

  return H5LotteryAward;
};
