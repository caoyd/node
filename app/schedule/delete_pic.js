const Subscription = require('egg').Subscription;
const fs = require('fs');
const join = require('path').join;

function findSync(startPath) {
  let result = [];

  function finder(path) {
    let files = fs.readdirSync(path);
    files.forEach((val, index) => {
      let fPath = join(path, val);
      let stats = fs.statSync(fPath);
      if (stats.isDirectory()) finder(fPath);
      if (stats.isFile()) result.push(fPath);
    });
  }

  finder(startPath);
  return result;
}

class DeletePic extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      type: 'worker', // 指定所有的 worker 都需要执行
      cron: '0 0 0 * * *'
    };
  }

  //
  // // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    let fileNames = findSync('./app/public/photo/');
    console.log(fileNames);
    fileNames.map(path => {
      if (path) {
        fs.unlinkSync(path);
      }
    });
  }
}

module.exports = DeletePic;
