'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const cloudResource = app.model.define('table04_cloud_resource', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: STRING,
    key: STRING,
    value: STRING,
    explain: STRING,
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
  }, {
    tableName: 'table04_cloud_resource',
    paranoid: true,
    timestamps: true
  });

  return cloudResource;
};
