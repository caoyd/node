'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotGoodsApp = app.model.define('iot_goods_app', {
    goodsAppId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    goodsCommonId: {
      type: INTEGER,
      field: 'goods_common_id'
    },
    appId: {
      type: STRING,
      field: 'app_id'
    },
    classId: {
      type: STRING,
      field: 'class_id'
    },
    userGoodsId: {
      type: STRING,
      field: 'user_goods_id'
    },
    title: STRING,
    price: STRING,
    picUrl: {
      type: STRING,
      field: 'pic_url'
    },
    showPic: {
      type: STRING,
      field: 'show_pic'
    },
    desc: STRING,
    cid: STRING,
    barcode: STRING
  }, {
    tableName: 'iot_goods_app',
    paranoid: true,
    timestamps: true
  });

  return IotGoodsApp;
};
