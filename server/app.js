/**
*author: XXXX
*data: XXXX
*project: myproject/server
*/
var express = require("express");
var bodyParser = require('body-parser');
var log4js = require('log4js');
var config = require("./common/config");
var api_router = require("./routers/api_router");

var app = express();    // 搭建express服务器

// 配置请求规则
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    res.header("Content-Security-Policy", "upgrade-insecure-requests");
    next();
});

// 该处进行路由相关配置
app.use(bodyParser.json());    // 用于解析请求
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api",api_router);    // 该处用于定义路由

// 进行日志配置
log4js.configure('./log4js.json');
var logger = log4js.getLogger('normal');
app.use(log4js.connectLogger(logger, {level:log4js.levels.INFO}));

// 进行对应端口请求监听
app.listen(config.port,function(){
    console.log("Listening on port:" + config.port);
});
