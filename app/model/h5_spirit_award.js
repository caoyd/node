'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN} = app.Sequelize;
  const Award = app.model.define('h5_1_award', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    awardName: {
      type: STRING,
      field: 'award_name'
    },
    awardCode: {
      type: STRING,
      field: 'award_code'
    },
    total: INTEGER,
    extract: STRING,
    probability: BOOLEAN,
  }, {
    tableName: 'h5_1_award',
    paranoid: true,
    timestamps: true
  });
  return Award;
};
