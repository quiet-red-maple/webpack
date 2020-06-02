/*
  webpack配置文件
  作用：指示webpack干哪些活 （当运行webpack指令时，会加载里面的配置）
  所有构建工具都是基于nodejs平台运行的模块化采用commonjs
*/

// resolve 用来拼接绝对路径的方法
const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

// 设置nodejs环境变量
process.env.NODE_ENV = 'development';

module.exports = {
  // webpack 配置
  // 入口起点
  entry: './src/index.js',
  // 输出
  output: {
    // 输出文件名
    filename: 'built.js',
    // 输出路径
    // __dirname node.js的变量，代表当前文件的目录绝对路径
    path: resolve(__dirname, 'build')
  },
  // loader配置
  module: {
    rules: [
      // js 兼容处理
      // 1、@babel/preset-env 只能转换基本语法
      // 2、@babel/polyfill
      // 直接将所有兼容代码引入，增大体积
      // 3、按需加载兼容处理
      // core-js

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          // 预设：指示babel做怎样的兼容处理
          presets: [
            [
              '@babel/preset-env',
              {
                // 按需加载
                useBuiltIns: 'usage',
                // 指定core-js版本
                corejs: {
                  version: 3
                },
                targets: {
                  chrome: '60',
                  firefox: '60',
                  ie: '9',
                  safari: '10',
                  edge: '17'
                }
              }
          ]
          ]
        }
      },
      // 详细loader配置
      // 不同文件配置不同的loader处理
      {
        // 匹配哪些文件
        test: /\.css$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左，从下到上依次执行
          // 创建style标签，将js中的样式资源插入，添加到head中生效
          'style-loader',
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          // 整合在js中
          'css-loader',
        ]
      },
      {
        // 匹配哪些文件
        test: /\.less$/,
        // 使用哪些loader进行处理
        use: [
          // use数组中loader执行顺序：从右到左，从下到上依次执行
          // 创建style标签，将js中的样式资源插入，添加到head中生效
          // 'style-loader',
          // 取代style-loader 作用： 提取js中的css成单独文件
          MiniCssExtractPlugin.loader,
          // 将css文件变成commonjs模块加载js中，里面内容是样式字符串
          'css-loader',
          // css兼容处理：postcss ==> postcss=loader postcss-preset-env
          // 帮postcss找到package.json中browserslist里面的配置，通过配置加载指定的css兼容性样式

          //   "browserslist": {
          //     "deveploment": [
          //         "last 1 chrome version",
          //         "last 1 firefox version",
          //         "last 1 safari version"
          //     ],
          //     "production": [
          //         ">0.2%",
          //         "not dead",
          //         "mot op_mimi all"
          //     ]
          // }

          // 使用loader的默认配置
          // 'postcss-loader'
          // 修改loader的配置
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')()
              ]
            }
          },
          // 将less编译成css文件
          'less-loader'
        ]
      },
      {
        // 处理图片资源
        // 问题处理不了html中img图片
        test: /\.(jpg|png|jpeg|gif)$/,
        // loader仅有一条时可以这么写
        // 安装url-loader 和 file-loader (url-loader依赖file-loader)
        loader: 'url-loader',
        options: {
          // 图片小于8kb 时会base64处理
          // 优点： 减少请求数量（减轻服务器压力）
          // 缺点：图片体积会更大（文件请求速度慢）
          limit: 12 * 1024,
          // 旧版本webpack 假如出现[object Module]片是commonjs
          // 问题url-loader默认使用了而es6模块化解析，而html-loder引入图
          // 解决关闭url-loader的es6模块化，使用commonjs解析
          // esModule: false
          // [hash:10]取图片的hash前10位
          // [ext]  取文件原来的扩展名
          name: '[hash:10].[ext]'
        }
      },
      {

        test: /\.html$/,
        // 处理html文件中的img图片（负责引入img,从而能被url-loder进行处理）
        loader: 'html-loader',
      },
      // 打包其他资源（除了html/js/css资源以外的资源）
      {
        // 排除css/js/json/less/html资源
        exclude: /\.(css|js|json|less|html|png|jpeg|gif|jpg)$/,
        loader: 'file-loader',
        options: {
          name: '[hash:10].[ext]'
        }
      },
      // 语法检查： eslint-loader eslint
      // 注意：只检查自己写的源代码，第三方库不用检查
      // 设置检查规则：
      // package.json 中 eslintConfig中设置
      //   "eslintConfig": {
      //     "extends": "airbnb-base"
      // }
      // airbnb --> eslint-config-airbnb-base eslint eslint-plugin-import
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: 'eslint-loader',
      //   options: {
      //     // 代码格式自动修复
      //     fix: true
      //   }
      // },
    ]
  },
  // plugins配置
  plugins: [
    // 详细plugins配置
    // html-webpack-plugin
    // 功能：默认会创建一个空的Html，自动引入打包输出的所有资源（js/css）
    new HtmlWebpackPlugin({
      // 复制 './src/index.html' 文件，并自动引入打包输出的所有资源（js/css）
      template: './src/index.html',
      minify: {
        // 移除空格
        collapseWhitespace: true,
        // 移除注释
        removeComments: true
      }
    }),
    // 单独输出css文件
    new MiniCssExtractPlugin({
      // 对输出文件重命名
      filename: 'css/built.css'
    }),
    // 压缩css
    new optimizeCssAssetsWebpackPlugin()
  ],
  // 模式
  mode: 'development', // 开发模式
  // mode: 'production', // 生产模式js会自动压缩

  // 开发服务器 devServer: 自动化（自动编译，自动打开浏览器，自动刷新浏览器）
  // 只会在内存中编译打包，不会有任何输出
  // 启动devServer指令为：npx webpack-dev-server
  devServer: {
    // 项目构建后路径
    contentBase: resolve(__dirname, 'build'),
    // 启动gzip压缩
    compress: true,
    // 端口号
    port: 3000,
    // 自动打开浏览器
    open: true
  }
}