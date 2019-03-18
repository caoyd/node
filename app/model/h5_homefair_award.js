'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const H5HomefairAward = app.model.define('h5_homefair_award', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: STRING,
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
    tableName: 'h5_homefair_award',
    paranoid: true,
    timestamps: true
  });

  return H5HomefairAward;
};
