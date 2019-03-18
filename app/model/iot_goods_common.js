'use strict';
module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const IotGoodsCommon = app.model.define('iot_goods_common', {
    goodsId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    tenantId: {
      type: STRING,
      field: 'tenant_id'
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
    skus: STRING,
    desc: STRING,
    showPic: {
      type: STRING,
      field: 'show_pic'
    },
    cid: STRING,
    barcode: STRING
  }, {
    tableName: 'iot_goods_common',
    paranoid: true,
    timestamps: true
  });

  return IotGoodsCommon;
};
