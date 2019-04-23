const log4js = require('log4js');
const async = require('async');
const logger = log4js.getLogger('controller/userAccount');
const mysqlClient = require('../libs/mysqlutil');

const inOutMapping = {
    "InOrOut": {
        "1": "收入",
        "2": "支出"
    }
};

/**
 * 查询用户账单接口函数
 * @param req
 * @param callback
 */
exports.findUserAccountList = function(req, callback) {
    let searchArray = [];  // 定义查询条件
    let sql = "SELECT a.*,c.PhoneID " +
        "FROM user_account a " +
        "LEFT JOIN sa_user b ON a.ID = b.ID " +
        "LEFT JOIN user_cellphone c ON a.ID = c.ID ";
    if (req.ID) {  // web端查询条件中是否包含id
        sql += "WHERE a.ID = ? ";
        searchArray.push(req.SAID)
    }
    if (req.RealName) {  // web端查询条件中是否包含RealName
        sql += "WHERE a.RealName LIKE ? ";
        searchArray.push("%" + req.RealName + "%")
    }
    if (req.PhoneID) {
        sql += "WHERE PhoneID LIKE ? ";
        searchArray.push("%" + req.PhoneID + "%")
    }
    if (req.LowAmount && req.HighAmount) {
        sql += "WHERE Amount BETWEEN ? AND ? ";
        searchArray.push(req.LowAmount);
        searchArray.push(req.HighAmount)
    }
    if (req.RecordTime) {
        sql += "WHERE RecordTime BETWEEN ? AND ? ";
        searchArray.push(req.RecordTime[0]);
        searchArray.push(req.RecordTime[1])
    }
    let orderDict = {"descending": "DESC", "ascending": "ASC"};
    if((req.OrderField && req.AscOrDesc)){
        if ((req.OrderField === 'RealName')) {
            sql += " ORDER by convert(" + req.OrderField + " using gbk) collate gbk_chinese_ci " + orderDict[req.AscOrDesc]
        }else {
            sql += " ORDER BY " + req.OrderField + " " + orderDict[req.AscOrDesc]
        }
    } else {
        if ((req.selectSort1 && req.DescAsc1)|| (req.selectSort2 && req.DescAsc2)){
            sql += " ORDER by " + req.selectSort1 + " " + req.DescAsc1 + "," + req.selectSort2 + " " + req.DescAsc2
        }
    }

    // 获取查询到数据的总数
    var countSql = "SELECT COUNT(middle_table.AccountID) AS Counts " +
        "FROM " + "((" + sql + ")" + " AS middle_table) ";

    sql  += " LIMIT ? OFFSET ? ";
    let pageNum = parseInt(req.PageNum);  // 每页显示数据条数
    let page = (parseInt(req.Page) -1) * parseInt(req.PageNum);  // 页码
    searchArray = searchArray.concat([pageNum, page]);
    let result = {};

    // 顺序执行函数，查询所需结果
    async.waterfall([async.apply(queryData, req, searchArray, sql, countSql, result), queryTotal],function(err, result) {
        if (err) {
            logger.error(err);
        }
        callback(err, result);
    })
};

/**
 * 数据库查询账单
 * @param req
 * @param searchArray
 * @param sql
 * @param countSql
 * @param result
 * @param callback
 */
function queryData(req, searchArray, sql, countSql, result, callback) {
    // 连接数据库进行查询
    mysqlClient.executeQuery(sql, searchArray, function (err, rows) {
        if (err) {
            logger.info(err);
        } else {
            rows.forEach(function (item) {
                for (let key in item) {
                    if (key in inOutMapping) {
                        item[key] = inOutMapping[key][item[key]]
                    }
                }
            });
            result.data = rows;
        }
        callback(err, searchArray, countSql, result)
    })
}

/**
 * 数据库查询总数
 * @param searchArray
 * @param countSql
 * @param result
 * @param callback
 */
function queryTotal(searchArray, countSql, result, callback) {
    // 连接数据库进行查询
    mysqlClient.executeQuery(countSql, searchArray, function (err, row) {
        if (err) {
            logger.error(err)
        } else {
            result.total = row[0]["Counts"];
        }
        callback (err, result)
    })
}

/**
 * 数据库增加收入/支出金额数值
 * @param req
 * @param cb
 */
exports.addUserAccountAmount = function(req, cb) {
    async.waterfall([async.apply(getUpdateSQL, req.AccountID, req.Number), executeUpdate],
        function (err, result) {
        if (err){
            logger.error(err)
        }
        cb(err, result)
    })
};

function getUpdateSQL(AccountID, Number, callback) {

    let sql = 'UPDATE user_account' +
        ' SET Amount = Amount + ' + Number;

    if (Array.isArray(AccountID)){
        AccountID = AccountID.join(",");
    }
    sql += ' WHERE AccountID in ('+AccountID+')';
    // ('update sql : %s ', sql);
    callback(null, sql);
}


function executeUpdate(updateSQL, cb) {
    mysqlClient.executeQuery(updateSQL, function(err, res) {
        if (err) {
            logger.error(err);
        }
        cb(null, res);
    });
}
