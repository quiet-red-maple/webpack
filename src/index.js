/*
  入口文件
  1、运行指令：
  开发环境：webpack ./src/index.js -o ./build/built.js --mode=development
  生产环境：webpack ./src/index.js -o ./build/built.js --mode=production
 */

// import '@babel/polyfill'; // 加载所有的兼容
import './index.less';
import './iconfont/iconfont.css';

import data from './dataJson.json';

// 下一行的eslint所有规则都不进行检查
// eslint-disable-next-line
console.log(data);

const add = (x, y) => x + y;

// eslint-disable-next-line
console.log(add(5, 6));
// eslint-disable-next-line
console.log(add(1, 16));

const promise = new Promise((resolve) => {
  setTimeout(() => {
    console.log('www');
    resolve()
  }, 1000)
})

console.log(promise)
