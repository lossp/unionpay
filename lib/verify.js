const crypto = require('crypto');
const utilities = require('../utilities/index');

module.exports = {
  verify(params) {
    // 提供校验数据
    const signatureStr = params.signature;
    const params1 = utilities.filterPara(params);
    const prestr = utilities.createLinkString(params1, false, true);
    const publicKey = params.signPubKeyCert;
    // 以下部分为公钥验签名
    const sha1 = crypto.createHash('sha256');
    sha1.update(prestr, 'utf8');
    const ss1 = sha1.digest('hex');
    // 公钥验签
    const verifier = crypto.createVerify('sha256');
    verifier.update(ss1);
    const verifyResult = verifier.verify(publicKey, signatureStr, 'base64');
    return verifyResult;
  },
};
