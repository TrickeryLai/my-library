const path = require("path");
//__dirname 当前目录绝对路径
// path.resolve 拼接路径

// 打包生成 模板文件并引入 output 文件
const HtmlWebpackPlugin = require("html-webpack-plugin");

// output 对应文件输出关系
const ManifestPlugin = require("webpack-manifest-plugin");

const webpack = require("webpack");

module.exports = {
  entry: {
    app: "./src/index.js",
    // main: "./src/main.js",
  },
  output: {
    filename: "[name].js",
    chunkFilename: "[name].bundle.js", // 非入口文件模块名称，用于动态导入
    path: path.resolve(__dirname, "dist"),
    publicPath: "./", // 资源引入地址前缀
  },
  // devtool: "source-map", //eval， 生产环境适合 source-map 单独生成source map 文件
  plugins: [
    new ManifestPlugin(),
    new HtmlWebpackPlugin({
      title: "teee",
      template: "./index.html",
      filename: 'index.html',
      meta: {
        // 'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        // Will generate: <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        'theme-color': '#4285f4'
        // Will generate: <meta name="theme-color" content="#4285f4">
      }
    }),
  ],
  // 提取模块，可以按照大小提取
  optimization: {
    splitChunks: {
      chunks: "all",
      //   minSize: '30000',// 模块压缩之前大小，进行提取 默认 30000
      // name: 'vendor',
      // 会将 node_mudules 文件夹中的模块打包进一个叫 vendors的bundle中，不同入口文件引用超过两次的模块分配到 default bundle 中
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 匹配node_modules目录下的文件
          priority: -10, // 优先级配置项
        },
        default: {
          minChunks: 2,
          priority: -20, // 优先级配置项
          reuseExistingChunk: true,
        }
      },
    },
  },
  resolve: {
    //设置模块如何被解析 第三方包
    // 使用绝对路径，将只在给定目录中搜索。
    modules: [path.resolve("node_modules")],
    // 之前引入方式为import style from 'src/css/style.css',使用别名后import style from 'css/style.css'
    alias: {
      // 创建别名
      css: path.resolve(__dirname, "src/css"),
      img: path.resolve(__dirname, "src/img"),
    },
    // 自动解析确定的扩展,如果引入import index from './index',没有后缀名
    //如果当前文件夹下有index.js，默认找index.js，如果没有index.js,就找index.vue，否则找index.json
    extensions: [".js", ".vue", ".json"],
  },
  module: {
    rules: [{
        test: /\.(jpg|png|svg)$/,
        include: path.resolve(__dirname, "src"),
        use: ["file-loader"],
      },
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src"),
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};