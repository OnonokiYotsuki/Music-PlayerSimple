//用户的每一个请求都会对应后台的一个具体的请求处理函数，而router.js只用于匹配和分发请求，不负责具体的请求处理。所以，我们需要在controllers文件夹下创建一个music.js文件，用于处理用户的具体请求。
var formidable = require("formidable");
var path = require("path");
var qstring = require("querystring");
var config = require("../config");
var mysql = require("mysql");
var pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
});

exports.showIndex = function (req, res) {
  //测试连接
  pool.query("select * from storage", function (err, data) {
    if (err) {
      console.error("数据库查询操作出错:", err);
      return res.end(err.message);
    }
    if (data.length > 0) console.log("连接成功");
    if (data.length == 0) console.log("连接失败");

    res.render("index", {
      title: "首页",
      musicList: data,
    });
  });
};
exports.showAdd = function (req, res) {
  res.render("add", {
    title: "添加音乐",
  });
};
exports.doAdd = function (req, res) {
  console.log("doAdd 被执行了");
  const options = {
    multiples: true,
    uploadDir: config.uploadPath,
    keepExtensions: true,
  };
  var form = new formidable.IncomingForm(options);
  console.log("开始解析表单数据");

  form.parse(req, function (err, fields, files) {
    if (err) {
      console.error("表单数据解析出错:", err);
      return res.end(err.message);
    }

    console.log("表单数据解析成功");
    console.log("文件对象:", files);
    var title = fields.title;
    var singer = fields.singer;
    var music = path.basename(files.music.filepath);
    var poster = path.basename(files.poster.filepath);

    // 在这里执行数据库插入操作
    var sql =
      "INSERT INTO storage (title, singer, music, poster) VALUES (?, ?, ?, ?)";
    var values = [title, singer, music, poster];

    pool.query(sql, values, function (err, result) {
      if (err) {
        console.error("数据库插入操作出错:", err);
        return res.end(err.message);
      }

      console.log("数据库插入操作成功");
      console.log("插入的行数:", result.affectedRows);

      console.log("重定向到首页");
      res.writeHead(302, {
        location: "http://127.0.0.1:3000/",
      });
      res.end();
    });
  });
};

exports.doRemove = function (req, res) {
  console.log("doRemove 被执行了");
  var id = req.query.id;

  // 在这里执行数据库删除操作
  var sql = "DELETE FROM storage WHERE id = ?";
  var values = [id];

  pool.query(sql, values, function (err, result) {
    if (err) {
      console.error("数据库删除操作出错:", err);
      return res.end(err.message);
    }

    console.log("数据库删除操作成功");

    // 删除成功后重定向到首页
    res.writeHead(302, {
      location: "http://127.0.0.1:3000/",
    });
    res.end();
  });
};

exports.showEdit = function (req, res) {
  var id = req.query.id;

  // 在这里执行数据库查询操作，获取要编辑的音乐信息
  var sql = "SELECT * FROM storage WHERE id = ?";
  var values = [id];

  pool.query(sql, values, function (err, result) {
    if (err) {
      console.error("数据库查询操作出错:", err);
      return res.end(err.message);
    }

    if (result.length === 0) {
      // 未找到对应的音乐记录
      return res.end("未找到要编辑的音乐");
    }

    var EditMusic = result[0];
    res.render("edit", {
      title: "编辑音乐",
      music: EditMusic,
    });
  });
};

exports.doEdit = function (req, res) {
  console.log("doEdit 被执行了");
  var id = req.query.id;

  // 获取用户提交的数据
  var data = "";
  req.on("data", function (chunk) {
    data += chunk;
  });
  req.on("end", function () {
    var postBody = qstring.parse(data);
    var title = postBody.title;
    var singer = postBody.singer;

    // 在这里执行数据库更新操作
    var sql = "UPDATE storage SET title = ?, singer = ? WHERE id = ?";
    var values = [title, singer, id];

    pool.query(sql, values, function (err, result) {
      if (err) {
        console.error("数据库更新操作出错:", err);
        return res.end(err.message);
      }

      console.log("数据库更新操作成功");

      // 更新成功后重定向到首页
      res.writeHead(302, {
        location: "http://127.0.0.1:3000",
      });
      res.end();
    });
  });
};
