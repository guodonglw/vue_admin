/**
 * Created by *** on 18/11/7.
 */
const log4js = require('log4js');
const logger = log4js.getLogger("mysql");
const config = require('../common/config');
const mysql = require('mysql');
let mysqlPool = null;

/**
 * init mysql pool
 * @return {null}
 */
function initMysqlPool() {
  logger.info('init mysql pool');
  mysqlPool = mysql.createPool(config.mysql_config);
}

/**
 * 执行查询SQL
 * @param  {[type]}   sql      [description]
 * @param  {[type]}   param    [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
exports.executeQuery = function(sql, param, callback) {
  if (!mysqlPool) {
    initMysqlPool();
  }
  // logger.info('allConnections num :', mysqlPool._allConnections.length);
  // logger.info('freeConnections num :', mysqlPool._freeConnections.length);
  mysqlPool.query(sql, param, function(err, rows, field) {
    if (err) {
      logger.error(err);
    }
    return callback(err, rows);
  });
}





