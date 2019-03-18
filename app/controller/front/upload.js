const {Controller} = require('egg');
const fs = require('fs');
const promisify = (nodeFunction) => {
  function promisified(...args) {
    return new Promise((resolve, reject) => {
      function callback(err, ...result) {
        if (err)
          return reject(err);
        if (result.length === 1)
          return resolve(result[0]);
        return resolve(result);
      }

      nodeFunction.call(null, ...args, callback);
    });
  }

  return promisified;
};
const writeFileAsync = promisify(fs.writeFile);
const readFileAsync = promisify(fs.readFile);

class UploadController extends Controller {

  async photoUpload() {
    const {ctx} = this;
    const {base64} = ctx.request.body;
    const [, data] = base64.split(',');
    const buffer = Buffer.from(data, 'base64');
    const photoId = ctx.makeId();
    const name = `${photoId}.png`;
    await writeFileAsync('./app/public/photo/' + name, buffer);
    ctx.body = ctx.wrapper({result: true, name});
  }

  async photoDownload() {
    const {ctx} = this;
    const {image} = ctx.params;
    ctx.response.contentType = 'application/octet-stream';
    try {
      ctx.body = await readFileAsync('./app/public/photo/' + image);
    } catch (e) {
      ctx.body = '下载失败';
    }
  }
}

module.exports = UploadController;
