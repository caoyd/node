'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const h5AssistanceConfig = app.model.define('h5_assistance_config', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activity: STRING,
    dailyAssistanceCount: {
      type: INTEGER,
      field: 'daily_assistance_count'
    },
    totalAssistanceCount: {
      type: INTEGER,
      field: 'total_assistance_count'
    },
    dailySameUserCount: {
      type: INTEGER,
      field: 'daily_same_user_count'
    },
    totalSameUserCount: {
      type: INTEGER,
      field: 'total_same_user_count'
    },
  }, {
    tableName: 'h5_assistance_config',
    paranoid: true,
    timestamps: true
  });
  return h5AssistanceConfig;
};
