/* 
  入口文件
  1、运行指令：
  开发环境：webpack ./src/index.js -o ./build/built.js --mode=development
  生产环境：webpack ./src/index.js -o ./build/built.js --mode=production
 */

 import './index.less';
 import './iconfont/iconfont.css';

 import data from './dataJson.json';

 console.log(data)

 function add (x, y) {
  return x + y
 }

 console.log(add(5,6))
 console.log(add(1,16))