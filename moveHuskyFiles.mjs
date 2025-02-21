import callfile from 'child_process';
import fs from 'fs';
import path from 'path';
/** 主要版本 */
// eslint-disable-next-line no-undef
const major = process?.version?.match(/v([0-9]*).([0-9]*)/)?.[1];
/** 特性版本 */
// eslint-disable-next-line no-undef
const minor = process?.version?.match(/v([0-9]*).([0-9]*)/)?.[2];

// 如果使用gitkraken7.7.2以下版本的工具，默认的hooks目录是.git/hooks下，需要执行此命令，其他情况下忽略
cpSync(
  // eslint-disable-next-line no-undef
  path.resolve('./', '.husky'),
  // eslint-disable-next-line no-undef
  path.resolve('./', '.git/hooks')
);
/**
 * 文件夹复制
 * @param {string} source 源文件夹
 * @param {string} destination 目标文件夹
 */
function cpSync(source, destination) {
  // 判断node版本不是16.7.0以上的版本
  // 则进入兼容处理
  // 这样处理是因为16.7.0的版本支持了直接复制文件夹的操作
  if (Number(major) < 16 || (Number(major) === 16 && Number(minor) < 7)) {
    // 如果存在文件夹 先递归删除该文件夹
    if (fs.existsSync(destination)) fs.rmSync(destination, { recursive: true });
    fs.mkdirSync(destination, { recursive: true });
    const rd = fs.readdirSync(source);
    for (const fd of rd) {
      const sourceFullName = source + '/' + fd;
      const destFullName = destination + '/' + fd;
      const lstatRes = fs.lstatSync(sourceFullName);
      if (lstatRes.isFile()) fs.copyFileSync(sourceFullName, destFullName);
      if (lstatRes.isDirectory()) cpSync(sourceFullName, destFullName);
    }
  } else fs.cpSync(source, destination, { force: true, recursive: true });
}

// 使git识别修改文件名大小写问题
callfile.exec('git config core.ignorecase false');
