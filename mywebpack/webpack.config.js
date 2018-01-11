
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        app: "./js/entry.js",
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename:  "dist.js"
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: "style!css"
            }
        ]
    },
    plugins:[
        new HtmlWebpackPlugin(
            {
                minify: {//压缩
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                title: '测试标题',
                filename: './index.html',
                template: path.join('./template.tpl.html'),
                hash: true,
                cache: true,
                inject: true,//插入静态资源， true/ body  插入到body 元素的底部， head 插入到head 元素中， false, 所有静态css 和js 都不会注入到模板文件中
            }
        ),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        hot: true,
        open: true
    }
};