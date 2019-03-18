'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE, TIME} = app.Sequelize;
  const IotResource = app.model.define('iot_resource', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    infoId: {
      type: STRING,
      field: 'info_id'
    },
    type: {
      type: STRING,
      field: 'type'
    },
    startDate: {
      type: TIME,
      field: 'start_date'
    },
    endDate: {
      type: TIME,
      field: 'end_date'
    },
    appId: {
      type: STRING,
      field: 'app_id'
    },
    key: STRING,
    value: STRING,
  }, {
    tableName: 'iot_resource',
    paranoid: true,
    timestamps: true
  });

  return IotResource;
};
