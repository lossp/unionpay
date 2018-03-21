const wopenssl = require('wopenssl');
const certParser = require('./utils');
/**
 * @function parseSignedDataFromPfx
 * @description 获取签名数据
 * @param {string} path - 证书文件.pfx的路径
 * @param {string} password - 解析.pfx文件所需的密码，默认为000000
 * @return {{certificate: *, privateKey: *}}
 */
function parseSignedDataFromPfx(path, password) {
  const extractedData = wopenssl.pkcs12.extract(path, password);
  return {
    certificate: extractedData.certificate,
    privateKey: extractedData.rsa,
  };
}

/**
 * @function parseCertData
 * @description Decrypting encryption data from certificate data.
 * @param {string} certificate - 证书数据
 * @param certificate
 * @return {Object}
 */
function parseCertData(certificate) {
  const certData = wopenssl.x509.parseCert(certificate);
  const certId = certParser.hexToDecimal(certData.serial);
  return certId;
}

module.exports = {
  parseSignedDataFromPfx,
  parseCertData,
};
