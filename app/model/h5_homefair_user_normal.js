'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const HomeFairUserNormal = app.model.define('h5_homefair_user_normal', {
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
    isReceive: {
      type: BOOLEAN,
      field: 'is_receive'
    },
    follow: BOOLEAN,
    cart: BOOLEAN
  }, {
    tableName: 'h5_homefair_user_normal',
    paranoid: true,
    timestamps: true
  });

  return HomeFairUserNormal;
};
