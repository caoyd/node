'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const GoodsTaobao = app.model.define('table07_cloud_goods_taobao', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numIid: {
      type: STRING,
      field: 'num_iid'
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    soldQuantity: {
      type: STRING,
      field: 'sold_quantity'
    },
    skus: {
      type: STRING,
      field: 'skus'
    },
    propImgs: {
      type: STRING,
      field: 'prop_imgs'
    },
    title: {
      type: STRING,
      field: 'title'
    },
    picUrl: {
      type: STRING,
      field: 'pic_url',
    },
    price: {
      type: STRING,
      field: 'price'
    },
    barcode: {
      type: STRING,
      field: 'barcode'
    },
    buyShow: {
      type: STRING,
      field: 'buy_show'
    }
  }, {
    tableName: 'table07_cloud_goods_taobao',
    paranoid: true,
    timestamps: true
  });

  return GoodsTaobao;
};
