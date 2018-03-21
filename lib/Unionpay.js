const request = require('request');
const moment = require('moment');

const verify = require('./verify');
const utilities = require('../utilities/index');
const signHelper = require('./signHelper');

class Unionpay {
  constructor(config) {
    const {
      frontUrl,
      backUrl,
      merId,
      certId,
      privateKey,
      publicKey,
      frontReqUrl,
      queryTransUrl,
    } = config;
    this._config = Object.assign({}, {
      frontUrl,
      backUrl,
      merId,
      certId,
      privateKey,
      publicKey,
      frontReqUrl,
      queryTransUrl,
    });
  }

  /**
   * @description 创建支付订单的操作
   * @param {String} orderIdNo   - 用户支付订单号
   * @param {String} txnAmtValue - 用户支付金额
   * @param {Object} options     - 附加信息，银联会原样返回，用于平台中的校验
   *
   */
  buildPayment(orderIdNo, txnAmtValue) {
    return new Promise((resolve, reject) => {
      // const { passbackParams } = options;
      // const { clientName } = passbackParams;
      const necessaryParams = {
        version: '5.1.0',
        encoding: 'utf-8',
        signMethod: '01',
        txnType: '01',
        txnSubType: '01',
        bizType: '000202',
        accessType: '0',
        backUrl: this._config.backUrl,
        frontUrl: this._config.frontUrl,
        currencyCode: '156',
        merId: this._config.merId,
        orderId: orderIdNo,
        txnAmt: txnAmtValue,
        txnTime: moment().format('YYYYMMDDHHmmss'),
        payTimeout: moment().add(10, 'minutes').format('YYYYMMDDHHmmss'),
        certId: this._config.certId,
        channelType: '07',
        // reqReserved: clientName,
      };
      console.log(necessaryParams);
      console.log('----->>>>>>',this._config);
      const result = signHelper.signatureGenerate(necessaryParams, this._config.privateKey);
      try {
        request.post(this._config.frontReqUrl, { form: result }, (err, response, body) => {
          if (err) {
            throw (new Error(err));
          }
          console.log(body)
          return resolve(body);
        });
      } catch (ex) {
        return reject(new Error('生成订单时候发生错误'));
      }
      return true;
    });
  }

  /**
   * @description 查询订单交易状态的操作
   * @param {String} orderIdNo  - 用户支付订单号
   * @param {String} txnTime    - 订单提交到银联的时间，需要格式为YYYYMMDDHHmmss
   */
  query(orderIdNo, txnTime) {
    return new Promise((resolve, reject) => {
      const necessaryParams = {
        version: '5.1.0',
        encoding: 'utf-8',
        signMethod: '01',
        txnType: '00',
        txnSubType: '00',
        bizType: '000000',
        accessType: '0',
        channelType: '07',
        orderId: orderIdNo,
        merId: this._config.merId,
        txnTime: moment(txnTime).format('YYYYMMDDHHmmss'),
        certId: this._config.certId,
      };
      const result = signHelper.signatureGenerate(necessaryParams, this._config.privateKey);
      try {
        request.post(this._config.queryTransUrl, { form: result }, (err, response, body) => {
          const splitedString = body.split('&');
          const paramsObject = utilities.transferParams(splitedString);
          return resolve(paramsObject);
        });
      } catch (ex) {
        return reject(new Error('查询订单时候发生错误'));
      }
      return true;
    });
  }

  /**
   * @description 用来验证银联回调签名
   * @param {Object} params    - 支付成功之后银联回调的数据
   */
  verifyCallback(params) {
    this.result = verify.verify(params);
    return this.result;
  }
}

module.exports = Unionpay;
