const { enumDir, uploadScp } = require("../utils/utils");
const fs = require("fs");
const path = require("path");
const colors = require("colors-console");

console.log(colors("blue", "[上传开始]"));
enumDir("./build/")
  // SCP上传部分
  .then(async files => {
    files.map(async file => {
      const dirent = fs.lstatSync(file);
      // 抹掉绝对路径前缀以及Build路径
      const dirName = file
        .replace(path.resolve(__dirname, "./build/"), "")
        .replace(/\\/g, "/");
      // 目录不需要处理Scp将会自动递归创建目录
      // 如果是文件就执行Scp上传
      if (dirent.isFile()) {
        console.log(colors("yellow", "[upload] => " + dirName));
        await uploadScp(file, dirName);
      }
    });
  })
  .then(() => {
    console.log(colors("green", "[上传完毕]"));
  });
