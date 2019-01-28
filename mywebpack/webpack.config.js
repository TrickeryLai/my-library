
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const env = process.env.NODE_ENV;

const debug   = (env !== 'production');

module.exports = {
    // entry: {
    //     app: path.join(__dirname, "/js/entry.js"),
    // },
    entry: [__dirname + "/js/entry.js"],
    output: {
        path: path.join(__dirname, '/dist'),
        filename:  '[name]' + (debug ? '' : '') + '.js',

        // 对于热替换(HMR)是必须的，让 webpack 知道在哪里载入热更新的模块(chunk)
    },
    module: {
        loaders: [
            {
                test: '/\.(jsx|es6|js)$/',
                // use: ['babel'],
                loader: 'babel-loader',
                exclude: /node_modules/, //不进行转换的文件，可以提高打包速度
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.(tpl|ejs)$/,
                loader: 'ejs'
            }
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(
            {
                minify: {//压缩
                    collapseWhitespace: true,
                    removeComments: true,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true
                },
                title: '',
                filename: './index.html',
                template: path.join('./template.tpl.html'),
                hash: false,
                cache: false,
                inject: true,//插入静态资源， true/ body  插入到body 元素的底部， head 插入到head 元素中， false, 所有静态css 和js 都不会注入到模板文件中
            }
        )
       
    ],
    resolve: {
        alias: {
            'common': path.resolve(__dirname, './js/common'),
            'until': path.resolve(__dirname, './js/until'),
        }
    },
    devServer: {
        historyApiFallback: true,

         // 和上文 output 的“publicPath”值保持一致
        host: 'localhost',
        noInfo: true,
        hot: true,
        open: true,
        port: 8001
    }
};