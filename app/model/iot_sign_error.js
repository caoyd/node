'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotSignError = app.model.define('iot_sign_error', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    generatedSign: {
      type: STRING,
      field: 'generated_sign'
    },
    sign: STRING,
    content: STRING,
    type: STRING
  }, {
    tableName: 'iot_sign_error',
    paranoid: true,
    timestamps: true
  });

  return IotSignError;
};
