'use strict';

module.exports = app => {
  const {STRING, INTEGER, DATE} = app.Sequelize;
  const TemplateStore = app.model.define('table02_cloud_template_store', {
    templateId: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'id'
    },
    href: STRING,
    title: STRING,
    type: STRING,
    description: STRING,
    background: STRING,
    resource: STRING,
    path: STRING
  }, {
    tableName: 'table02_cloud_template_store',
    paranoid: true,
    timestamps: true
  });

  return TemplateStore;
};
