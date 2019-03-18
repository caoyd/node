'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotFaceCommon = app.model.define('iot_face_common', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    appId: {
      type: STRING,
      field: 'app_id'
    },
    faceName: {
      type: STRING,
      field: 'face_name'
    },
    faceId: {
      type: STRING,
      field: 'face_id'
    },
    faceImage: {
      type: STRING,
      field: 'face_image'
    },
  }, {
    tableName: 'iot_face_common',
    paranoid: true,
    timestamps: true
  });

  return IotFaceCommon;
};
