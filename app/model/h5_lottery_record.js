'use strict';

module.exports = app => {
  const {STRING, INTEGER} = app.Sequelize;
  const h5LotteryRecord = app.model.define('h5_lottery_record', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activity: STRING,
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    award: STRING,
    type: STRING,
  }, {
    tableName: 'h5_lottery_record',
    paranoid: true,
    timestamps: true
  });

  return h5LotteryRecord;
};
