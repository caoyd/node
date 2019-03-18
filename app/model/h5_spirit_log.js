'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN} = app.Sequelize;
  const Log = app.model.define('h5_1_log', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    action: STRING,
    log: STRING,
  }, {
    tableName: 'h5_1_log',
    paranoid: true,
    timestamps: true
  });
  return Log;
};
