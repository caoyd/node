'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const H5VolvoUser = app.model.define('h5_volvo_user', {
      userId: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        field: 'id'
      },
      mixNick: {
        type: STRING,
        field: 'mix_nick'
      },
      playCount: {
        type: INTEGER,
        field: 'play_count'
      },
      gameLottery: {
        type: STRING,
        field: 'game_lottery'
      },
      assistanceLottery: {
        type: STRING,
        field: 'assistance_lottery'
      },
      assistanceCount: {
        type: INTEGER,
        field: 'assistance_count'
      },
      address: STRING,
      name: STRING,
      telephone: STRING,
      avatar: STRING
    },
    {
      tableName: 'h5_volvo_user',
      paranoid: true,
      timestamps: true
    });
  H5VolvoUser.associate = () => {
    H5VolvoUser.hasMany(app.model.H5LotteryRecord, {
      as: 'award', foreignKey: 'mixNick', sourceKey: 'mix_nick'
    });
  };
  return H5VolvoUser;
};
