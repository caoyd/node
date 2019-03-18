'use strict';

module.exports = app => {
  const {STRING, INTEGER} = app.Sequelize;
  const h5SeoLog = app.model.define('h5_seo_log', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ip: STRING,
    agent: STRING,
    pv: Boolean,
    uv: Boolean,
    type: STRING,
  }, {
    tableName: 'h5_seo_log',
    paranoid: true,
    timestamps: true
  });

  return h5SeoLog;
};
