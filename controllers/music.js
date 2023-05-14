//用户的每一个请求都会对应后台的一个具体的请求处理函数，而router.js只用于匹配和分发请求，不负责具体的请求处理。所以，我们需要在controllers文件夹下创建一个music.js文件，用于处理用户的具体请求。
var formidable = require("formidable");
var path = require("path");
var qstring = require("querystring");
var config = require("../config");

var storage = [
  {
    id: 1,
    title: "富士山下",
    singer: "陈奕迅",
    muisc: "陈奕迅 - 富士山下.mp3",
    poster: "陈奕迅.jpg",
  },
  {
    id: 2,
    title: "石头记",
    singer: "达明一派",
    muisc: "达明一派 - 石头记.mp3",
    poster: "达明一派.jpg",
  },
];
exports.showIndex = function (req, res) {
  res.render("index", {
    title: "首页",
    musicList: storage,
  });
};
exports.showAdd = function (req, res) {
  res.render("add", {
    title: "添加音乐",
  });
};
exports.doAdd = function (req, res) {
  console.log("doAdd 被执行了");
  var form = new formidable.IncomingForm();
  form.uploadDir = config.uploadPath;
  form.keepExtensions = true;
  form.parse(req, function (err, fields, files) {
    if (err) {
      return res.end(err.message);
    }
    var title = fields.title;
    var singer = fields.singer;
    var music = path.basename(files.music.path);
    var poster = path.basename(files.poster.path);
    var id = 0;
    storage.forEach(function (item) {
      if (item.id > id) {
        id = item.id;
      }
    });
    storage.push({
      id: id + 1,
      title: title,
      singer: singer,
      music: music,
      poster: poster,
    });
    res.writeHead(302, {
      'location': "http://127.0.0.1:3000/",
    });
    res.end();
  });
};
exports.doRemove = function (req, res) {
  console.log("doRemove 被执行了");
  var id = req.query.id;
  var music_index = 0;
  storage.forEach(function (item, index) {
    if (item.id === parseInt(id)) {
      music_index = index;
    }
  });
  storage.splice(music_index, 1);
  res.writeHead(302, {
    'location': "http://127.0.0.1:3000/",
  });
  res.end();
};
exports.showEdit = function (req, res) {
  var id = req.query.id;
  var music = {};
  storage.forEach(function (item) {
    if (item.id === parseInt(id)) {
      music = item;
    }
  });
  res.render("edit", {
    title: "编辑音乐",
    music: music,
  });
};
exports.doEdit = function (req, res) {
  console.log("doEdit 被执行了");
  var id = req.query.id;
  //获取用户提交的数据
  var data = "";
  req.on("data", function (chunk) {
    data += chunk;
  });
  req.on("end", function () {
    var postBody = qstring.parse(data);
    //根据id找到要修改的音乐
    var music_index = 0;
    storage.forEach(function (item, index) {
      if (item.id === id) {
        music_index = index;
      }
    });
    //修改音乐信息
    storage[music_index].title = postBody.title;
    storage[music_index].singer = postBody.singer;
    //跳转到首页
    res.writeHead(302, {
      'location': "http://127.0.0.1:3000",
    });
    res.end();
  });
};
