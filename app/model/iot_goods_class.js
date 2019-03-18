'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotGoodsClass = app.model.define('iot_goods_class', {
    classId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    appId: {
      type: STRING,
      field: 'app_id'
    },
    classPicUrl: {
      type: STRING,
      field: 'class_pic_url'
    },
    className: {
      type: STRING,
      field: 'class_name'
    },
    relationNum: {
      type: INTEGER,
      field: 'relation_num'
    },
  }, {
    tableName: 'iot_goods_class',
    paranoid: true,
    timestamps: true
  });

  return IotGoodsClass;
};
