const { enumDir, makeDirRemote, upload } = require("../utils/utils");
const Client = require("ftp");
const fs = require("fs");
const path = require("path");
const colors = require("colors-console");

var c = new Client();
c.on("ready", function() {
  // 递归遍历build文件夹，逐一上传/创建远端文件夹
  console.log(colors("blue", "上传开始..."));
  enumDir("./build/")
    // FTP 上传部分
    .then(async files => {
      files.map(async file => {
        const dirent = fs.lstatSync(file);
        const dirName = file.replace(path.resolve(__dirname, "./build/"), "");
        if (dirent.isDirectory()) {
          console.log(colors("blue", "[mkdir]  => " + dirName));
          await makeDirRemote(c, dirName);
        }
        if (dirent.isFile()) {
          console.log(colors("yellow", "[upload] => " + dirName));
          await upload(c, file, dirName);
        }
      });
    })
    .then(() => {
      console.log(colors("green", "传输完成！"));
      c.end();
    });
});

c.connect({
  user: "july",
  password: "000000",
  connTimeout: 3000,
  pasvTimeout: 3000
});
