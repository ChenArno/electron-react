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

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
const { description } = require('../package.json')
const PORT = 8000

const webpackDevConfig = merge(common, {
  mode: 'development',
  output: {
    filename: 'js/[name].[hash:8].bundle.js'
  },
  devServer: {
    contentBase: outDirSrc,
    open: false,
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
      title: description,
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
  ]
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
