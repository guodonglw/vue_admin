/**
 *    该处为全局配置文件
 */
const config = {
    port:"4001",
    log_path: ".\\logs\\",       // log文件的位置
    mysql_config: {
        host: '',
        user: '',
        password: '',
        database: '',
        connectionLimit: 20,
        dateStrings:true  // 强制日期类型(TIMESTAMP, DATETIME, DATE)以字符串返回
    },
};

module.exports = config;
