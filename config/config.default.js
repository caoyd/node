const path = require('path');

module.exports = appInfo => {
  return ({
    view: {
      defaultViewEngine: 'nunjucks',
      defaultExtension: '.html',
      // 如果还有其他模板引擎，需要合并多个目录
    },

    keys: 'yule',
    multipart: {
      fileExtensions: ['.xlsx'], // 增加对 .apk 扩展名的支持
      fileSize: '10mb',
      // mode: 'file',

    },
    avatarUrl: 'http://192.168.1.6:5000/public',
    baseDir: path.resolve(__dirname, '../', 'upload'),
    session: {
      key: 'yule',
      maxAge: 24 * 3600 * 1000, // 1 天
      httpOnly: true,
      encrypt: true,
    },
    security: {
      csrf: {
        enable: false,
      },
    },
    bodyParser: {
      'enable': true,
      'encoding': 'utf8',
      'formLimit': '1mb',
      'jsonLimit': '10mb',
      'strict': true,
      'queryString': {
        'arrayLimit': 100,
        'depth': 5,
        'parameterLimit': 1000
      },
      'returnRawBody': true

    },
    cors: {
      // {string|Function} origin: '*',
      // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
      origin: '*',
      allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true
    },
    // sequelize: {
    //   dialect: 'mysql',
    //   database: 'yooofun',
    //   // host: '192.168.199.177',
    //   host: '127.0.0.1',
    //   port: 3306,
    //   username: 'root',
    //   password: 'wangyi12358',
    //   timezone: '+08:00'
    // },
    // sequelize: {
    //   dialect: 'mysql',
    //   database: 'yule_cloud',
    //   host: 'rm-vy13071o122233m5y.mysql.rds.aliyuncs.com',
    //   port: 3306,
    //   username: 'jusrje3sfjgz',
    //   password: 'MXLmxl13141314',
    //   timezone: '+08:00'
    // },
    cluster: {
      listen: {
        port: 5000,
        // hostname: '114.55.1.106',
        // path: '/var/run/egg.sock',
      }
    },
    taobao: {
      AppKey: '25018990',
      AppSecret: '220d9aa564fb927514ce81daf06ae87a',
      redirectUrl: 'https://yoofun.ews.m.jaeapp.com/index.html'
    },
    iot: {
      redirectUrl: 'http://yoofun.ews.m.jaeapp.com/iot/index.html',
      skin: {
        appKey: '25509607',
        appSecret: '7f66624569eaa5e3712e31a3c40ba59a',
      },
      face: {
        appKey: '25530051',
        appSecret: '98166850b5d3319ef55d4cd655f7ac5c',
      },
      bluetooth: {
        appKey: '25551055',
        appSecret: 'acf8864e4de551d4a3db6731489dc8a8',
      },
      advertisement: {
        appKey: '25541049',
        appSecret: '8d0b991a8d42188dc7f1d122c95be2aa',
      }
    },
    static: {
      dir: [path.join(appInfo.baseDir, '/upload'), path.join(appInfo.baseDir, '/app/public')],
      maxAge: 0
    }
  })
};
// exports.keys = 'yule';
// exports.multipart = {
//   fileExtensions: ['.xlsx'], // 增加对 .apk 扩展名的支持
//   fileSize: '10mb',
//   // mode: 'file',
//
// };

// exports.avatarUrl = 'http://192.168.1.6:5000/public/upload';

// exports.baseDir = path.resolve(__dirname, '..', 'upload/iot');
// module.exports = appInfo => ({
//   view: {
//     // 如果还有其他模板引擎，需要合并多个目录
//     root: path.join(appInfo.baseDir, 'app/assets'),
//   },
// });

// exports.view = {
//     defaultViewEngine: 'nunjucks',
//     root: path.join(appInfo.baseDir, 'app/assets'),
// };
// exports.session = {
//   key: 'yule',
//   maxAge: 24 * 3600 * 1000, // 1 天
//   httpOnly: true,
//   encrypt: true,
// };
// exports.security = {
//   csrf: {
//     enable: false,
//   },
// };
//
// exports.bodyParser = {
//   'enable': true,
//   'encoding': 'utf8',
//   'formLimit': '1mb',
//   'jsonLimit': '10mb',
//   'strict': true,
//   'queryString': {
//     'arrayLimit': 100,
//     'depth': 5,
//     'parameterLimit': 1000
//   },
//   'returnRawBody': true
//
// };
// exports.cors = {
//   // {string|Function} origin: '*',
//   // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
//   origin: '*',
//   allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
//   credentials: true
// };
// exports.view = {
//   defaultViewEngine: 'nunjucks',
//   defaultExtension: '.html'
// };
//
// // exports.sequelize = {
// //   dialect: 'mysql',
// //   database: 'yule_cloud',
// //   host: 'rm-vy13071o122233m5y.mysql.rds.aliyuncs.com',
// //   port: 3306,
// //   username: 'jusrje3sfjgz',
// //   password: 'MXLmxl13141314',
// //   timezone: '+08:00'
// // };
//
// exports.sequelize = {
//   dialect: 'mysql',
//   database: 'yooofun',
//   // host: '192.168.199.177',
//   host: 'localhost',
//   port: 3306,
//   username: 'root',
//   password: 'wangyi12358',
//   timezone: '+08:00'
// };
//
// exports.cluster = {
//   listen: {
//     port: 5000,
//     // hostname: '114.55.1.106',
//     // path: '/var/run/egg.sock',
//   }
// };
//
// exports.taobao = {
//   AppKey: '25018990',
//   AppSecret: '220d9aa564fb927514ce81daf06ae87a',
//   redirectUrl: 'https://yoofun.ews.m.jaeapp.com/index.html'
// };
//
//
// exports.iot = {
//   redirectUrl: 'http://yoofun.ews.m.jaeapp.com/iot/index.html',
//   skin: {
//     appKey: '25509607',
//     appSecret: '7f66624569eaa5e3712e31a3c40ba59a',
//   },
//   face: {
//     appKey: '25530051',
//     appSecret: '98166850b5d3319ef55d4cd655f7ac5c',
//   },
//   bluetooth: {
//     appKey: '25551055',
//     appSecret: 'acf8864e4de551d4a3db6731489dc8a8',
//   },
//   advertisement: {
//     appKey: '25541049',
//     appSecret: '8d0b991a8d42188dc7f1d122c95be2aa',
//   }
// };
//
// exports.static = {
//   maxAge: 0
// };