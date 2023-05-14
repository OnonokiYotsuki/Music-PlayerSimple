/* *
 * 路由模块：负责把具体的请求路径分发给具体的请求处理函数
 * 分发到具体的业务处理逻辑
 */
var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var musicController = require("./controllers/music");
var url = require("url");

module.exports = function (req, res) {
  /* 使用url核心模块的parse方法后，该方法会自动把路径部分解析到pathname属性中
   * 同时也会把查询字符串部分解析到query属性
   * 对于url.parse方法的第二个参数，如果传递true，那么就会把query属性查询字符串转换为一个对象
   */
  var urlObj = url.parse(req.url, true);
  req.query = urlObj.query;
  console.log(urlObj.query);
  //获取请求路径
  var pathname = urlObj.pathname;
  var method = req.method;
  console.log(method);
  //匹配请求路径，将请求发送到相应的处理函数
  if (method === "GET" && pathname === "/") {
    musicController.showIndex(req, res);
  } else if (method === "GET" && pathname === "/index.html") {
    musicController.showIndex(req, res);
  } else if (method === "GET" && pathname.startsWith("/node_modules/")) {
    var staticPath = path.join(__dirname, pathname);
    fs.readFile(staticPath, function (err, data) {
      if (err) {
        return res.end(err.message);
      }
      res.end(data);
    });
  } else if (method === "GET" && pathname === "/add") {
    musicController.showAdd(req, res);
  } else if (method === "GET" && pathname === "/edit") {
    musicController.showEdit(req, res);
  } else if (method === "GET" && pathname === "/remove") {
    musicController.doRemove(req, res);
  } else if (method === "post" && pathname === "/add") {
    musicController.doAdd(req, res);
  } else if (method === "post" && pathname === "/edit") {
    musicController.doEdit(req, res);
  }
};
