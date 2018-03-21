const crypto = require('crypto');
const utilities = require('../utilities/index');

module.exports = {
  /**
   * @description  生产签名(算法是sha256)
   * @param {Object} params       -签名所需要的参数
   * @param {String} privateKey   -签名所需要的私钥
   */
  signatureGenerate(params, privateKey) {
    const newObj = params;
    if (Object.prototype.toString(params) === '[object Object]' && typeof privateKey === 'string') {
      const prestr = utilities.createLinkString(params, true, true);
      const sha1 = crypto.createHash('sha256');
      sha1.update(prestr, 'utf8');
      const ss1 = sha1.digest('hex');
      // 私钥签名
      const sign = crypto.createSign('sha256');
      sign.update(ss1);
      const sig = sign.sign(privateKey, 'base64');
      newObj.signature = sig;
    } else {
      return false;
    }
    return newObj;
  },
};
