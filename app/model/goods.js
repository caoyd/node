'use strict';
module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const Goods = app.model.define('table08_cloud_goods', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    goodsTaobaoId: {
      type: STRING,
      field: 'goods_taobao_id'
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    customTitle: {
      type: STRING,
      field: 'title',
    },
    customPrice: {
      type: STRING,
      field: 'price'
    },
    customPicUrl: {
      type: STRING,
      field: 'pic_url'
    },
    customShowPic: {
      type: STRING,
      field: 'show_pic'
    },
    customDescription: {
      type: STRING,
      field: 'description'
    },
    customCid: {
      type: STRING,
      field: 'cid'
    },
    customBarcode: {
      type: STRING,
      field: 'barcode'
    }
  }, {
    tableName: 'table08_cloud_goods',
    paranoid: true,
    timestamps: true
  });

  Goods.associate = function() {
    app.model.Goods.belongsTo(app.model.GoodsTaobao, {
      as: 'goodsTaobao',
      foreignKey: 'goodsTaobaoId',
      targetKey: 'numIid'
    });
  };
  return Goods;
};
