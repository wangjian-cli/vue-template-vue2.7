const path = require('path');
const fs = require('fs');

/**
 * 获取所有文件
 * @param {string} dir - 打包后文件目录
 * @returns 
 */
const getAllFiles = dir => {
  const result = [];

  const traverse = _pathname => {
    const files = fs.readdirSync(_pathname);

    for (const f of files) {
      const pathname = path.join(_pathname, f);
      if (fs.statSync(pathname).isDirectory()) {
        traverse(pathname);
      } else {
        result.push({
          path: pathname,
          name: f
        });
      }
    }
  };
  traverse(dir);
  return result;
};

const checkFilename = () => { 
  const directory = path.join(__dirname, '../html');
  const files = getAllFiles(directory);
  const errorList = [];
  for (const file of files) {
    let filenameArray = file.name.split('.');
    filenameArray = filenameArray.slice(0, filenameArray.length - 1);

    if (filenameArray.every(item => /^\d+$/g.test(item))) {
      errorList.push(file);
    }
  }

  if (errorList.length) {
    errorList.map(ef => {
      console.log('\x1b[31m', `[error] ${ef.name}文件命名为纯数字！path:${ef.path}`, '\x1b[0m');
      return ef;
    });
    process.exit(1);
  }
} 

const check = () => {
  // 检测文件名
  checkFilename();
  // ...more
}

check()