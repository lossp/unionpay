
module.exports = {
  createLinkString(params, encode, status) {
    let ks;
    let str = '';
    if (status === true) {
      ks = Object.keys(params).sort();
    } else {
      ks = Object.keys(params);
    }
    for (let i = 0; i < ks.length; i += 1) {
      let k = ks[i];
      if (encode === true) {
        k = encodeURIComponent(k);
      }
      if (str.length > 0) {
        str += '&';
      }
      if (k !== null && k !== undefined && k !== '') { // 如果参数的值为空不参与签名；
        str += `${k}=${params[k]}`;
        // str = str + k + '=' + params[k];
      }
    }
    return str;
  },
  transferParams(params) {
    const newParams = {};
    if (typeof params !== 'object') {
      return false;
    }
    for (let i = 0; i < params.length; i += 1) {
      const items = params[i].split('=');
      const key = items[0];
      const value = items[1];
      newParams[key] = value;
    }
    return newParams;
  },

  filterPara(params) {
    const obj = {};
    Object.keys(params).forEach((k) => {
      const newK = k;
      if (newK !== 'signature' && params[k]) {
        obj[k] = params[k];
      }
    });
    return obj;
  },
};
