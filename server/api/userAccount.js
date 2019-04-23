const log4js = require('log4js');
const logger = log4js.getLogger("api/userAccout");
const DB = require('../controller/userAccount');

/**
 * 获取账单信息的接口
 * @param {object} req
 * @param {object} res
 * @param {[type]} next
 */
exports.findUserAccoutList = function (req, res, next) {
    logger.info("admin:", adminName, ",find_user req: ", JSON.stringify(req.body));
    DB.findUserAccountList(req.body, function (err, result) {
        if (err) {
            logger.error(err);
            return res.json({"code": 1, "result": {}, "msg": err.sqlMessage})
        }else {
            logger.info("执行成功");
            return res.json({
                "code": 0, "result": result, "msg": "success"
            })
        }
    })
};

/**
 * 增加收入/支出金额的数值
 * @param req
 * @param res
 * @param next
 */
exports.addUserAccountAmount = function (req, res, next) {
    logger.info("admin:", adminName, ",add_user_account req: ", JSON.stringify(req.body));
    DB.addUserAccountAmount(req.body, function (err, result) {
        if (err) {
            logger.error(err);
            return res.json({"code": 1, "result": {}, "msg": err.sqlMessage})
        }else {
            logger.info("执行成功");
            return res.json({
                "code": 0, "result": result, "msg": "success"
            })
        }
    })
};
