/*
 * @Descripttion:
 * @version:
 * @Author: chenArno
 * @Date: 2019-12-12 14:59:42
 * @LastEditors: chenArno
 * @LastEditTime: 2020-03-21 09:47:24
 */
const merge = require('webpack-merge')
const common = require('./webpack.common.config')
const path = require('path')
const { outDirSrc } = require('./utils')
const theme = require('./theme')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const PORT = 8000

const webpackDevConfig = merge(common, {
  mode: 'development',
  output: {
    filename: 'js/[name].[hash:8].bundle.js'
  },
  devServer: {
    contentBase: outDirSrc,
    open: true,
    port: PORT,
    compress: true,
    host: 'localhost',
    hot: true,
    // 如果使用webpack-dev-server，需要设为true，禁止显示devServer的console信息
    quiet: true,
    // 编译出现错误时，将错误直接显示在页面上
    overlay: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html',
      inject: 'body',
      hash: false
    }),
    new webpack.HotModuleReplacementPlugin()
    // HotModuleReplacementPlugin是webpack热更新的插件，
    // 设置devServer.hot为true，并且在plugins中引入HotModuleReplacementPlugin插件即可。
    // 还需要注意的是我们开启了hot，
    // 那么导出不能使用chunkhash，需要替换为hash。
    // new FriendlyErrorsWebpackPlugin({
    //   compilationSuccessInfo: {
    //     messages: [`Your application is running here:http://127.0.0.1:8000`]
    //   },
    //   // onErrors:,
    //   clearConsole: true
    // })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            }
          },
          'postcss-loader'
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        // 表示哪些目录中的 .js 文件不要进行 babel-loader
        exclude: /node_modules/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]__[hash:base64:5]'
              }
            }
          },
          'postcss-loader',
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              sourceMap: true,
              modifyVars: theme,
              javascriptEnabled: true,
            },
          }
        ]
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              sourceMap: true,
              modifyVars: theme,
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(sass|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      }
    ]
  }
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = PORT
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      webpackDevConfig.devServer.port = port
      webpackDevConfig.plugins.push(
        new FriendlyErrorsWebpackPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: http://${webpackDevConfig.devServer.host}:${port}`
            ]
          },
          // onErrors: utils.createNotifierCallback(),
          clearConsole: true
        })
      )
      resolve(webpackDevConfig)
    }
  })
})
