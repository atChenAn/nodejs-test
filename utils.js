const path = require("path");
const fs = require("fs");
const scpClient = require("scp2");

async function enumDir(dirpath) {
  let targetItem = [];
  let dir = await fs.promises.readdir(dirpath);
  for await (const itemName of dir) {
    const nPath = path.resolve(dirpath, itemName);
    const dirent = fs.lstatSync(nPath);
    if (dirent.isDirectory()) {
      targetItem = [...targetItem, nPath, ...(await enumDir(nPath))];
    }
    if (dirent.isFile()) {
      targetItem.push(nPath);
    }
  }
  return targetItem;
}

async function makeDirRemote(c, file) {
  return new Promise((res, rej) => {
    c.mkdir(file, true, err => {
      if (err) {
        console.log(err);

        rej(err);
      } else {
        res();
      }
    });
  });
}
async function upload(c, file, path) {
  return new Promise((res, rej) => {
    c.put(file, path, err => {
      if (err) {
        console.log(err);
        rej(err);
      } else {
        res();
      }
    });
  });
}

async function uploadScp(file, dirName) {
  return new Promise((res, rej) => {
    scpClient.scp(
      file,
      `root:root@192.168.47.130:22:/root/webroot${dirName}`,
      function(err) {
        if (err) {
          rej(err);
        } else {
          res();
        }
      }
    );
  });
}

module.exports = {
  enumDir,
  makeDirRemote,
  upload,
  uploadScp
};
