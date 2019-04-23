const mysqlClient = require('../libs/mysqlutil');
const log4js = require('log4js');
const logger = log4js.getLogger('controller/total');
const async = require('async');

/**
 * 获取汇总列表
 * @param Condition
 * @param callback
 */
exports.findAllTotal = function(Condition, callback) {
    queryCountTotal(Condition, function(err, result) {
        if (err) {
            logger.error(err);
        }
        callback(err, result);
    });
};

// 中间函数（该函数可省略）
function queryCountTotal(Condition, cb) {
    async.waterfall([async.apply(getCountTotalSQL, Condition),
        getTotalRoles,
        getTotalUsers,
    ], function(err, result) {
        if (err) {
            logger.error(err);
        }
        cb(err, result);
    });
}

// 构建sql函数
function getCountTotalSQL(queryCondition, cb) {
    let searchArray = new Array();
    let countRoleSQL = " SELECT COUNT(a.ID) as RoleCount FROM sa_user a WHERE 1 = 1 ";
    let countUserSQL = " SELECT COUNT(b.AccountID) as UserAccountsCount FROM user_account b WHERE 1 = 1 ";
    if (queryCondition.QueryTime && queryCondition.QueryTime[0] && queryCondition.QueryTime[1]){
        countRoleSQL += "AND a.CreateTime BETWEEN ? AND ? ";
        countUserSQL += "AND b.RecordTime BETWEEN ? AND ? ";
        searchArray.push(queryCondition.QueryTime[0]);
        searchArray.push(queryCondition.QueryTime[1]);
    }
    cb(null, countRoleSQL, countUserSQL,  searchArray);
}

// 连接数据库查询函数
function getTotalRoles(countRoleSQL, countUserSQL, searchArray, callback) {
    mysqlClient.executeQuery(countRoleSQL, searchArray, function(err, rows) {
        let result = {};
        if (err) {
            logger.error(err);
        }
        if(rows && rows.length === 1) {
            result.RoleCount = rows[0]["RoleCount"];
        }
        callback(err, countUserSQL, searchArray, result);
    });
}

function getTotalUsers(countUserSQL, searchArray, result, callback) {
    mysqlClient.executeQuery(countUserSQL, searchArray, function(err, rows) {
        if (err) {
            logger.error(err);
        }
        if(rows && rows.length === 1) {
            result.UserAccountsCount = rows[0]["UserAccountsCount"];
        }
        callback(err, result);
    });
}

/**
 * 获取周汇总列表
 * @param Condition
 * @param callback
 */
exports.findWeekTotal = function(Condition, callback) {
    queryWeekTotal(Condition, function(err, result) {
        if (err) {
            logger.error(err);
        }
        callback(err, result);
    });
};

// 中间函数（该函数可集成到上面函数中）
function queryWeekTotal(Condition, cb) {
    async.waterfall([async.apply(getWeekTotalSQL, Condition),
        getWeekTotalRoles,
        getWeekTotalUsers
    ], function(err, result) {
        if (err) {
            logger.error(err);
        }
        cb(err, result);
    });
}

// 构建获取一周数据的sql语句
function getWeekTotalSQL(queryCondition, cb) {
    let searchArray = new Array();
    let countRoleSQL = " SELECT a.ID, a.CreateTime FROM `user` a WHERE 1 = 1 AND a.CreateTime BETWEEN ? AND ? ";
    let countUserSQL = " SELECT b.AccountID, b.RecordTime  FROM user_account b WHERE 1 = 1 AND b.RecordTime BETWEEN ? AND ? ";
    searchArray.push(queryCondition.QueryTime[0]);
    searchArray.push(queryCondition.QueryTime[1]);
    cb(null, countRoleSQL, countUserSQL,  searchArray);
}

// 获取一周用户每天数据
function getWeekTotalRoles(countRoleSQL, countUserSQL, searchArray, callback) {
    mysqlClient.executeQuery(countRoleSQL, searchArray, function(err, rows) {
        let result = {
            "Roles": {},
            "UserAccounts": {},
        };
        if (err) {
            logger.error(err);
        }
        if(rows && rows.length > 0) {
            rows.forEach(function(row) {
                key = row.CreateTime.substring(0, 10);
                if (result.Roles.hasOwnProperty(key)){
                    result["Roles"][key] += 1
                }else {
                    result["Roles"][key] = 1
                }
            });
        }
        callback(err, countUserSQL, searchArray, result);
    });
}

// 获取一周每天账单数据
function getWeekTotalUsers(countUserSQL, searchArray, result, callback) {
    mysqlClient.executeQuery(countUserSQL, searchArray, function(err, rows) {
        if (err) {
            logger.error(err);
        }
        if(rows && rows.length > 0) {
            rows.forEach(function(row) {
                key = row.RecordTime.substring(0, 10);
                if (result.UserAccounts.hasOwnProperty(key)){
                    result["UserAccounts"][key] += 1
                }else {
                    result["UserAccounts"][key] = 1
                }
            });
        }
        callback(err, result);
    });
}
