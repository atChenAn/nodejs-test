const { enumDir, uploadScp } = require("../utils/utils");
const fs = require("fs");
const path = require("path");
const colors = require("colors-console");
const archiver = require("archiver");

const output = fs.createWriteStream(__dirname + "/build.zip");
const archive = archiver("zip", {
  zlib: { level: 9 } // Sets the compression level.
});

output.on("close", function() {
  console.log("打包完成：" + archive.pointer() / 1024 + " total Kbytes");
});
archive.on("warning", function(err) {
  if (err.code === "ENOENT") {
    // log warning
    console.warn("[WARN]:" + err.message);
  } else {
    // throw error
    throw err;
  }
});
archive.on("error", function(err) {
  throw err;
});
archive.pipe(output);

console.log(colors("blue", "[打包开始]"));
enumDir("./build/")
  // ZIP打包部分
  .then(async files => {
    files.map(async file => {
      const dirent = fs.lstatSync(file);
      // 抹掉绝对路径前缀以及Build路径
      const dirName = file
        .replace(path.resolve(__dirname, "./build/"), "")
        .replace(/\\/g, "/");
      // 如果是文件就执行追加,目录不用关心，会自动递归创建
      if (dirent.isFile()) {
        console.log(colors("yellow", "[zip] => " + dirName));
        archive.append(fs.createReadStream(file), { name: dirName });
      }
    });
  })
  .then(() => {
    archive.finalize();
    console.log(colors("green", "[打包完毕]"));
  });
