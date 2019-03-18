'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const h5ActionLog = app.model.define('h5_action_log', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    action: STRING,
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    activity: STRING
  }, {
    tableName: 'h5_action_log',
    paranoid: true,
    timestamps: true
  });
  return h5ActionLog;
};
