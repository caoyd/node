'use strict';
module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const Classify = app.model.define('table16_cloud_classify', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: STRING,
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    children: STRING,
    level: INTEGER,
    alpha: STRING,
  }, {
    tableName: 'table16_cloud_classify',
    paranoid: true,
    timestamps: true
  });

  // Goods.associate = function() {
  //   app.model.Goods.belongsTo(app.model.GoodsTaobao, {
  //     as: 'goodsTaobao',
  //     foreignKey: 'goodsTaobaoId',
  //     targetKey: 'numIid'
  //   });
  // };
  return Classify;
};
