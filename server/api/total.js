const DB = require('../controller/total');
const log4js = require('log4js');
const logger = log4js.getLogger("api/total");

/**
 * @function findAllTotal
 * @param {object} req
 * @param {object} res
 * @param {[type]} next
 */
exports.findAllTotal = function (req, res, next) {
    logger.info("admin:", adminName, ",find_all_total req: ", JSON.stringify(req.body));
    DB.findAllTotal(req.body, function (err, result) {
        if (err) {
            logger.error(err);
            return res.json({"code": 1, "result": {}, "msg": err.sqlMessage})
        }else {
            logger.info("执行成功")
            return res.json({
                "code": 0, "result": result, "msg": "success"
            })
        }
    })
};

/**
 * @function findWeekTotal
 * @param {object} req
 * @param {object} res
 * @param {[type]} next
 */
exports.findWeekTotal = function (req, res, next) {
    logger.info("admin:", adminName, ",find_week_total req: ", JSON.stringify(req.body));
    DB.findWeekTotal(req.body, function (err, result) {
        if (err) {
            logger.error(err);
            return res.json({"code": 1, "result": {}, "msg": err.sqlMessage})
        }else {
            logger.info("执行成功")
            return res.json({
                "code": 0, "result": result, "msg": "success"
            })
        }
    })
};
