//用于解析模板标记语法，让页面可以使用<%=%>语法获取从后台传来的数据
var fs = require("fs");
var path = require("path");
var _ = require("underscore");
var config = require("../config");

module.exports = function (req, res) {
  //给res对象添加一个render方法，用来渲染模板
  res.render = function (viewName, obj) {
    //1.读取模板文件
    fs.readFile(
      path.join(config.viewPath, viewName) + ".html",
      "utf8",
      function (err, data) {
        if (err) {
          return res.end(err.message);
        }
        //2.解析模板文件中的模板标记语法
        var complied = _.template(data)

        //3.将模板标记语法替换为数据
        var htmlStr = complied(obj || {})
        //4.将替换后的结果返回给客户端
        res.end(htmlStr);
      }
    );
  };
};
