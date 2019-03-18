'use strict';

module.exports = app => {
  const {STRING, INTEGER, BOOLEAN, DATE} = app.Sequelize;
  const H5HomefairLog = app.model.define('h5_homefair_log', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user: {
      type: STRING,
      field: 'user'
    },
    operation: {
      type: STRING,
      field: 'operation'
    },
    msg: {
      type: STRING,
      field: 'msg'
    },
    type: STRING
  }, {
    tableName: 'h5_homefair_log',
    paranoid: true,
    timestamps: true
  });

  return H5HomefairLog;
};
