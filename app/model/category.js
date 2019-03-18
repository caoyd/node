'use strict';
module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const Category = app.model.define('table09_cloud_category', {
    cid: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    activityId: {
      type: STRING,
      field: 'activity_id'
    },
    parentId: {
      type: STRING,
      field: 'parent_id',
    },
    pic: STRING,
    name: STRING
  }, {
    tableName: 'table09_cloud_category',
    paranoid: true,
    timestamps: true
  });

  return Category;
};
