'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const HomeFairUserGanlanzsl = app.model.define('h5_homefair_user_galanzsl', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    shopKey: {
      type: STRING,
      field: 'shop_key'
    },
    follow: BOOLEAN,
    cart: BOOLEAN,
    followLottery: {
      type: STRING,
      field: 'follow_lottery'
    },
    cartLottery: {
      type: STRING,
      field: 'cart_lottery'
    },
    address: STRING,
    name: STRING,
    telephone: STRING,
    isReceive: {
      type: BOOLEAN,
      field: 'is_receive'
    }
  }, {
    tableName: 'h5_homefair_user_galanzsl',
    paranoid: true,
    timestamps: true
  });

  return HomeFairUserGanlanzsl;
};
