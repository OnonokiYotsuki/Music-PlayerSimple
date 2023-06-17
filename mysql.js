//测试用
//引入mysql模块
var mysql = require("mysql");
//创建连接池
var pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "musicplayer",
});
//测试连接
pool.query("select * from storage", function (err, results) {
  if (err) throw err;
  console.log(results);
  if (results.length > 0) {
    console.log("连接成功");
  }
  if (results.length == 0) {
    console.log("连接失败");
  }
});
