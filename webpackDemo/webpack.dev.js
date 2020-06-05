const merge = require("webpack-merge");
const common = require("./webpack.common");

const webpack = require("webpack");

module.exports = merge(common, {
  devtool: "inline-source-map", //eval
  devServer: {
    hot: true,
    host: "",
    port: "8888",
    open: true,
    overlay: {
      errors: true,
    },
  },
  module: {
    rules: [
      // use 会从右至左顺序使用， css-loader 梳理样式文件，整合所有css， style-loader 则将整合的css 生成 style标签添加至head
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    // 模块热替换
    // new webpack.NamedModulesPlugin(), //更容易查看要修补(patch)的依赖
    new webpack.HotModuleReplacementPlugin(),

    // 指定当前环境
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(""),
    }),
  ],
});