'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const h5AssistanceRecord = app.model.define('h5_assistance_record', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    activity: STRING,
    mixNick: {
      type: STRING,
      field: 'mix_nick'
    },
    target: STRING,
  }, {
    tableName: 'h5_assistance_record',
    paranoid: true,
    timestamps: true
  });

  h5AssistanceRecord.associate = () => {
    h5AssistanceRecord.belongsTo(app.model.H5VolvoUser, {
      as: 'user', foreignKey: 'mixNick', targetKey: 'mixNick'
    });
  };
  return h5AssistanceRecord;
};
