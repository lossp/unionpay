const Unionpay = require('./lib/Unionpay');
const convert = require('./lib/convert');
const path = require('path');

// 首先获取privateKey的相对路径
const privateKeyPath = path.resolve(__dirname, './certificates/xxxx.pfx');
const password = 'xxxxxxx';
// 解析出相应的证书信息， 需要证书密码password
const p12Data = convert.parseSignedDataFromPfx(privateKeyPath, password);
// 获取privateKey 以及 publicKye
const { privateKey } = p12Data.privateKey;
console.log('传说中的rsa', privateKey);
const publicKey = p12Data.certificate;

// 解析publicKey，获取到certId
const certId = convert.parseCertData(publicKey);

const config = {
  version: '5.1.0', // 版本号，固定填写5.0.0
  encoding: 'utf-8',
  signMethod: '01', // 01：表示采用RSA,固定填写：01
  txnType: '01', // 固定填写：01
  txnSubType: '01', // 固定填写：01
  bizType: '000202', // 产品类型，000201：B2C网关支付
  accessType: '0', // 0：商户直连接入1：收单机构接入
  channelType: '07',
  frontUrl: 'http://localhost:8081/upacp_demo_b2b/demo/api_02_b2b/FrontReceive.php', // 前台通知地址，前台返回商户结果时使用，例：https://xxx.xxx.com/xxx
  backUrl: 'http://x222.222.222.222:8080/upacp_demo_b2b/demo/api_02_b2b/BackReceive.php', // 后台通知地址
  currencyCode: '156', // 交易币种，币种格式必须为3位代码，境内客户取值：156（人民币） 固定填写：156
  frontTransUrl: 'https://gateway.95516.com/gateway/api/frontTransReq.do', // 前台交易请求地址
  appTransUrl: 'https://gateway.95516.com/gateway/api/appTransReq.do', // APP交易请求地址
  backTransUrl: 'https://gateway.95516.com/gateway/api/backTransReq.do', // 后台交易请求地址
  cardTransUrl: 'https://gateway.95516.com/gateway/api/cardTransReq.do', // 后台交易请求地址(若为有卡交易配置该地址)：
  queryTransUrl: 'https://gateway.95516.com/gateway/api/queryTrans.do', // 单笔查询请求地址
  batchTransUrl: 'https://gateway.95516.com/gateway/api/batchTrans.do', // 批量查询请求地址
  TransUrl: 'https://filedownload.95516.com/', // 文件传输类交易地址
  merId: 'xxxxxxxxxx', // 测试商户号，已被批准加入银联互联网系统的商户代码
};
// 将certId, privateKey, publicKey, frontReqUrl放入config中
config.certId = certId;
config.privateKey = privateKey;
config.publicKey = publicKey;
config.frontReqUrl = 'https://gateway.test.95516.com/gateway/api/frontTransReq.do';
// 生成一个新的Unionpay实例
const unionpay = new Unionpay(config);

// 订单参数设置
const orderId = '12313131';
const txnAmtValue = '1000';
const result = unionpay.buildPayment(orderId, txnAmtValue);
// 返回的result转给前段就可以跳转至支付页面
console.log(result);
