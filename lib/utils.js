const BigInt = require('big-integer');

function hexToDecimal(hexStr) {
  return BigInt(hexStr, 16).toString();
}

module.exports = {
  hexToDecimal,
};
