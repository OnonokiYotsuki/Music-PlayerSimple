var http = require("http");
var config = require("./config");
var router = require("./router");
var render = require("./common/render"); // 引入 render.js 模块

var server = http.createServer();
server.on("request", function (req, res) {
  // 调用 render 函数，为 res 对象添加 render 方法
  render(req, res);
  // 分发请求给相应的业务处理逻辑
  router(req, res);
});
server.listen(config.port, function () {
  console.log("server is running at port " + config.port);
  console.log("please visit http://" + config.host + ":" + config.port);
});