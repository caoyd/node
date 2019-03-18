'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const H5HomefairItem = app.model.define('h5_homefair_item', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    shopKey: {
      type: STRING,
      field: 'shop_key'
    },
    itemId: {
      type: STRING,
      field: 'item_id'
    },
    skuId: {
      type: STRING,
      field: 'sku_id'
    },
  }, {
    tableName: 'h5_homefair_item',
    paranoid: true,
    timestamps: true
  });

  return H5HomefairItem;
};
