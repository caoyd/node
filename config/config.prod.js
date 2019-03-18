const path = require('path');
module.exports = appInfo => ({
  keys: 'yule',
  avatarUrl: 'http://yoofun.ews.m.jaeapp.com/public',
  baseDir: path.join(__dirname, '../../upload'),
  view: {
    defaultViewEngine: 'nunjucks',
    defaultExtension: '.html',
    // 如果还有其他模板引擎，需要合并多个目录
    // root: path.join(appInfo.baseDir, '/acs/upload'),
  },
  sequelize: {
    // dialect: 'mysql',
    // database: 'yooofun',
    // // host: '192.168.199.177',
    // host: 'localhost',
    // port: 3306,
    // username: 'root',
    // password: 'wangyi12358',
    // timezone: '+08:00'
    dialect: 'mysql',
    database: 'yule_cloud',
    host: 'rm-vy13071o122233m5y.mysql.rds.aliyuncs.com',
    port: 3306,
    username: 'jusrje3sfjgz',
    password: 'MXLmxl13141314',
    timezone: '+08:00',
  },
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
  cors: {
    // {string|Function} origin: '*',
    // {string|Array} allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
    credentials: true
  },
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
    },
    interaction: {
      appKey: '25538065',
      appSecret: '3f1ddef15107191c55fb7f468f88000b'
    }
  },
  static: {
    // dir: [path.join(), path.join(appInfo.baseDir, '/public')],
    dir: [path.join(__dirname, '../../upload'), path.join(appInfo.baseDir, '/app/public')],
    maxAge: 0
  }
});

// exports.keys = 'yule';
//
// exports.avatarUrl = 'http://yoofun.ews.m.jaeapp.com/public/upload';
//
// exports.baseDir = path.resolve(__dirname, '../app');
// module.exports = appInfo => ({
//   view: {
//     defaultViewEngine: 'nunjucks',
//     defaultExtension: '.html',
//     // 如果还有其他模板引擎，需要合并多个目录
//     root: path.join(appInfo.baseDir, '/acs/upload'),
//   },
// });
// exports.sequelize = {
//   dialect: 'mysql',
//   database: 'yule_cloud',
//   host: 'rm-vy13071o122233m5y.mysql.rds.aliyuncs.com',
//   port: 3306,
//   username: 'jusrje3sfjgz',
//   password: 'MXLmxl13141314',
//   timezone: '+08:00'
// };
//
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
//   },
//   interaction: {
//   	appKey: '25538065',
//   	appSecret: '3f1ddef15107191c55fb7f468f88000b'
//   }
// };
//
//
// exports.static = {
//   maxAge: 0
// };