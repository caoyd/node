'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN} = app.Sequelize;
  const Spirit = app.model.define('h5_1_spirit', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    chance: INTEGER,
    award: STRING,
    isAward: {
      type: BOOLEAN,
      field: 'is_award'
    },
    lastInto: {
      type: BOOLEAN,
      field: 'last_into'
    }
  }, {
    tableName: 'h5_1_spirit',
    paranoid: true,
    timestamps: true
  });

  return Spirit;
};
