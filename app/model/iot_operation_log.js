'use strict';

/**
 * action ['SKIN_DETECTION_CLICK', 'THEME_MAKEUP_CLICK', 'ITEM_CLICK', 'ITEM_TAKE', 'FACE_SCAN']
 */
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotOperationLog = app.model.define('iot_operation_log', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    action: STRING,
    appId: {
      type: STRING,
      field: 'app_id'
    },
    itemId: {
      type: STRING,
      field: 'item_id'
    },
    skinDetection: {
      type: STRING,
      field: 'skin_detection'
    },
  }, {
    tableName: 'iot_operation_log',
    paranoid: true,
    timestamps: true
  });

  return IotOperationLog;
};
