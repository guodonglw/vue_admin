# 该项目不太适合大型项目的开发

# web端vue+server端express项目开发

# web端vue项目（该项目受https://github.com/taylorchen709/vue-admin影响极大）

## 一、运行环境
node

## 二、开发环境搭建
```
// 将项目拉到本地
git clone 项目地址

// cd到本地项目下
cd ../vueProject

// 安装项目运行需要的依赖包
npm install / cnpm install  (注：如需运行cnpm install，需先安运行npm install cnpm安装cnpm)

// 若在npm install后，提示需要执行npm audit fix则继续执行该命令
npm audit fix

// 在本地开发时，运行项目
npm run dev / cnpm run dev

```
开发环境，在执行完上述步骤后，浏览器访问http://localhost:8082，可跳转到对应页面 （推进chrome浏览器）

## 三、项目发布
在开发环境中完成项目开发后，要将项目发布到服务器（如nginx服务器），首先在./config/prod.env.js的BASE_URL单引号内填上
请求地址（Server的接口地址，该处必须在双引号中将url地址用单引号包住，因为需要直接返回字符串路径时，就必须采用单引号把
字符串内容括起来，如BASE_URL:"'http://192.168.1.111:4000/api'"），在url后加端口号加'/api'，这是由于F2FAdminServer
端接口统一用了'url' + ':' + '端口号' + '/api'的形式，在完成上述修改后，进行下面的操作。

```
// 项目打包
npm run build / cnpm run build

// 查看是否生成了dist文件夹
在文件夹下包括index.html文件和static文件，如作了标题旁的图片，可能还有logo.ico

// cd到dist文件夹下
cd ./dist/

// 将dist文件夹下的static的文件夹与index.html文件直接放在nginx服务器根目录下

// 配置nginx，在nginx.conf文件中修改所要监听的端口

// chrome浏览器访问对应的域名，如http://xxx.xxx.com:123/
如部署到个人服务器，没有域名，访问地址为http:// + ip + ：端口号

```
在跳转到登录页面后，输入数据库对应表（如admin）中对应的账号/密码（如：lilei/123456）,若跳转到首页页面，则部署成功，否则根据所出现
的问题（按F12调出控制台进行查看），解决出现的问题，然后重复上述步骤。

# server端express项目

## 一、概述
server端服务器部署分为node.js服务器和MySQL数据库两部分工作

## 二、node.js服务器相关

### 一、node.js环境安装
方法一
```
wget https://nodejs.org/dist/v4.4.4/node-v4.4.4-linux-x64.tar.xz
tar -xvf node-v4.4.4-linux-x64.tar

```
方法二
```
sudo apt-get node

```
### 二、forever守护进程模块
node安装完成后，需要使用npm安装forever守护进程模块
```
// 全局安装
npm install -g forever

// 启动项目进程
forever start app.js

// 重启项目进程
forever restart app.js

//停止项目进程
forever stop app.js

```

## 三、MySQL数据库
如使用自己服务器数据库，需要安装MySQL
```
// 数据库初始化
mysql –uroot –p </root/xxx.sql

```

## 四、服务器部署与启动项目
```
// 安装项目依赖
npm install / cnpm install 

// 若在npm install后，提示需要执行git audit fix则继续执行该命令
npm audit fix

// 临时启动项目（检查项目是否有错误）
node app.js

// 后台守护进程启动项目
forever start app.js

```

# 关于https的配置补充

## 一、web端代码修改
```
// vue项目config/prod.env.js修改（改为https的请求协议）
BASE_URL:"'https://xxx.xxx.xxx:111/api'"

// 项目打包（如果之前已经build过，需先执行rm -r dist）
npm run build

// dist文件夹下index.html与static放到nginx下

```

## 二、Server端代码修改
```
// 停止Server程序
forever stop app.js

// 将ssl的.crt，.key放到Server/cert目录下

// 安装必要模块
npm install http --save -d (加--save -d会将模块名写入package.json中，下次npm install即可安装该模块)
npm install https --save -d
npm install fs --save -d

// app.js开始部分添加代码
var http = require('http');
var https = require('https');
var fs = require('fs');

// Configuare https
const httpsOption = {
    key : fs.readFileSync("./cert/.key"),
    cert: fs.readFileSync("./cert/.crt")
}

// app.js末尾部分代码修改
http.createServer(app).listen(4001 ,function(){
    console.log("Listening on port:" + 1000);
});
https.createServer(httpsOption, app).listen(
    1001,function(){
    console.log("Listening on port:" + 1001);
});

// 至此，https已经配置完成

```








