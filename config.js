//便于后期修改端口
var path = require("path");
//对外开放一个对象
module.exports = {
  port: 3000,
  host: "127.0.0.1",
  viewPath: path.join(__dirname, "./views"),
  uploadPath: path.join(__dirname, "./uploads"),
  user: "root",
  password: "123456",
  database: "musicplayer",
};
