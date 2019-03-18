'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const activity = app.model.define('table10_cloud_activity', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    unionId: {
      type: STRING,
      field: 'union_id'
    },
    activityOuterId: {
      type: STRING,
      field: 'activity_outer_id'
    },
    activityName: {
      type: STRING,
      field: 'activity_name'
    },
    userId: {
      type: STRING,
      field: 'user_id'
    },
    templateId: {
      type: STRING,
      field: 'template_id'
    },
    reportId: {
      type: STRING,
      field: 'report_id'
    },
    deviceId: {
      type: STRING,
      field: 'device_id'
    },
    storeId: {
      type: STRING,
      field: 'store_id',
    },
  }, {
    tableName: 'table10_cloud_activity',
    paranoid: true,
    timestamps: true
  });


  activity.associate = function () {
    app.model.Activity.belongsTo(app.model.TemplateStore, {
      as: 'template',
      foreignKey: 'templateId',
    });
  };
  return activity;
};
