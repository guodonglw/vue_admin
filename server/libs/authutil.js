/**
 * 工具库
 */

var crypto = require('crypto');
var log4js = require('log4js');
var logger = log4js.getLogger("auth");
require('../libs/dateUtil');

/**
 * MD5加解密工具
 * @param {String} password 密码字符串
 */
exports.MD5 = function(password) {
    hash = crypto.createHash('md5');
    hash.update(password);
    return hash.digest('hex');
};

/**
 * 获取请求的IP地址
 * @param  {Object} req 请求对象
 * @return {String}     IP地址
 */
exports.getClientIp = function(req) {
    return (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).replace('::ffff:','');
};


/**
 * 获取最后登录时间
 * @method  getLastLogin
 * @return  {string}     时间
 */
exports.getLastLogin = function () {
    let now = new Date()
    let LastLogin = new Date().Format("yyyy-MM-dd hh:mm:ss")
    let time = now.getTime();
    // logger.info(now,time,LastLogin)
    return LastLogin
};


exports.getVerifyCode = function(len) {
    if (!len) {
        len = 6;
    }
    var verifyCode = '';
    var alpha = '1234567890789890238490237841289342734829034720834902304982903482793084';
    for (var i = 0; i < len; i++) {
        verifyCode += alpha.charAt((Math.random() * 10000) % alpha.length);
    }
    return verifyCode.toString();
};


/**
 * 生成加密token
 * @method  setToken
 * @param   {string}  toke  生成token的内容
 * @return  {string}        token字符串
 */
exports.setToken = function (toke) {
    let content = {tokenContent: toke}; // 要生成token的主题信息
    let secretOrPrivateKey="123456"; // 这是加密的key（密钥）
    var token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60*60*1  // 1小时过期
    });
    return token
};

