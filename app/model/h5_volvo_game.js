'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const H5VolvoGame = app.model.define('h5_volvo_game', {
    gameId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    costTime: {
      type: INTEGER,
      field: 'cost_time'
    },
    car: STRING
  }, {
    tableName: 'h5_volvo_game',
    paranoid: true,
    timestamps: true
  });
  H5VolvoGame.associate = () => {
    H5VolvoGame.belongsTo(app.model.H5VolvoUser, {
      as: 'user', foreignKey: 'mixNick', targetKey: 'mixNick'
    });
  };
  return H5VolvoGame;
};
