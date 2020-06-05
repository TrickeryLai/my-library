const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
// 代码压缩
const UglifyjsWebpackPlugin = require("uglifyjs-webpack-plugin");

// css 文件分离
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 打包分布
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer");

// 清理 output 文件夹
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin");

module.exports = merge(common, {
  devtool: "source-map", // 生产环境适合 source-map 单独生成source map 文件， 减少最终输出文件体积
  module: {
    rules: [{
      test: /\.css$/,
      use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
            esModule: true,
            publicPath: './../', // 根据生成的具体css 文件设置资源路径，比如背景图片，字体路径
          },
        },
        "css-loader",
      ],
    }, ],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new MiniCssExtractPlugin({
      filename: "style/[name].[hash].css",
    }),

    new UglifyjsWebpackPlugin({
      sourceMap: true, // devtool 开启 source map 需设置为true
    }),

    // 指定当前环境
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),

    new BundleAnalyzerPlugin.BundleAnalyzerPlugin(),
  ],
});