# UnionPay B2B 支付，查询，验证文档

首先而言，这是针对银联B2B支付的SDK，PC端的B2B支付 !!
重要提醒，目前只完善了支付，查询以及验证，还未完善退款功能，以后会补上
针对于PC端，B2B支付，CNY，这些参数在Unionpay.js中已经定死了，如果需要修改，可以自行修改
由于银联官方问题，对于证书，需要下载的是5.0.0版本的证书，但是验证却是5.1.0的方法，这里很尴尬，如有懂的，请告诉下，非常感谢。
以下为简单教程
第一步，首先去银联网站下载相关证书，目前需要的是5.0.0的证书，请勿下载错误。
第二步如下
```
// 1.首先引入包
const Unionpay = require('unionpaysdk');

// 2.其次配置相关参数 此配置均为测试环境，正式环境需要将.test去掉
const config = {
  frontUrl: 'http://localhost:8081/upacp_demo_b2b/demo/api_02_b2b/FrontReceive.php', // 前台通知地址，前台返回商户结果时使用，例：https://xxx.xxx.com/xxx
  backUrl: 'http://x222.222.222.222:8080/upacp_demo_b2b/demo/api_02_b2b/BackReceive.php', // 后台通知地址
  frontTransUrl: 'https://gateway.test.95516.com/gateway/api/frontTransReq.do', // 前台交易请求地址
  appTransUrl: 'https://gateway.test.95516.com/gateway/api/appTransReq.do', // APP交易请求地址
  backTransUrl: 'https://gateway.test.95516.com/gateway/api/backTransReq.do', // 后台交易请求地址
  cardTransUrl: 'https://gateway.test.95516.com/gateway/api/cardTransReq.do', // 后台交易请求地址(若为有卡交易配置该地址)：
  queryTransUrl: 'https://gateway.test.95516.com/gateway/api/queryTrans.do', // 单笔查询请求地址
  batchTransUrl: 'https://gateway.test.95516.com/gateway/api/batchTrans.do', // 批量查询请求地址
  TransUrl: 'https://filedownload.test.95516.com/', // 文件传输类交易地址
  merId: 'xxxxxxxxxx', // 测试商户号，已被批准加入银联互联网系统的商户代码
};

// 3.将证书进行解析，先实例化Unionpay
let parser = new Unionpay();

// 4.将.pfx的相对路径以及密码当作参数传入函数中，获取到解析结果result，里面包含privateKey以及certificate，将其提取出来
const path = 'xxxxxxx/xxx/xx'
const password = 'xxxxxx'
const result = parser.parseSignedDataFromPfx(path, password);
const { privateKey } = result;
const { certificate } = result; 

// 4.解析certificate，获取到相应的certId
const certId = parser.parseCertData(certificate);

// 5.将解析出来的参数添加至config里面，当作公共参数去实例化Unionpay
config.certId = certId;
config.privateKey = privateKey;
config.publicKey = certificate;
// 如果要改成正式环境，只需要将test去掉即可
config.frontReqUrl = 'https://gateway.test.95516.com/gateway/api/frontTransReq.do';

// 6.实例化Unionpay
const unionpay = new Unionpay(config);

// 7.然后设置相应参数，比如金额和订单号，就可以生成相应订单
// 订单参数设置
const orderId = '12313131';
const txnAmtValue = '1000';
// 其中options为附近信息，比如商品描述等，但是传入进reqReserved中的必须为字符串，并且长度有限定，此处只做大致演示
const options = 'xxzcz';
const result = unionpay.buildPayment(orderId, txnAmtValue, options);
// 回来的result为html格式的文档，打开之后会自动跳转到支付页面，即支付成功
console.log(result);
```
查询功能的话，直接调用query就可以

```
const unionpay = new Unionpay();
// 商户订单号
const orderId = '122231313' ;
// 订单提交到银联的时间
const txnTime = '2018-09-23 09:23:23'
const queryResult = unionpay.query(orderId, txnTime)
// 获取到的queryResult为JSON对象，里面有支付具体信息，根据业务具体进行解析

```

签名验证，确认信息是银联返回过来的
```
// 回调数据部分的验签，调用verify方式即可
// params为银联返回过来的数据，通过后台通知地址获取信息
unionpay.verifyCallback(params)
```


退款功能还未完善，请大家多多谅解，谢谢支持




