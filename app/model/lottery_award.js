'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const LotteryAward = app.model.define('table06_cloud_lottery_award', {
    awardId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    awardName: {
      type: STRING,
      field: 'award_name'
    },
    awardLink: {
      type: STRING,
      field: 'award_link'
    },
    awardWeight: {
      type: STRING,
      field: 'award_weight'
    },
    awardCount: {
      type: STRING,
      field: 'award_count'
    },
    awardExtract: {
      type: STRING,
      field: 'award_extract'
    },
    awardLocation: {
      type: STRING,
      field: 'award_location'
    },
  }, {
    tableName: 'table06_cloud_lottery_award',
    paranoid: true,
    timestamps: true
  });

  return LotteryAward;
};
