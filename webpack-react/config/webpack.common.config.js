/*
 * @Descripttion:
 * @version:
 * @Author: chenArno
 * @Date: 2019-12-12 14:53:30
 * @LastEditors: chenArno
 * @LastEditTime: 2020-03-21 09:47:00
 */
const path = require('path')
const webpack = require('webpack')
const { outDirSrc } = require('./utils')

function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    // babel-polyfill 兼容性问题
    index: ['babel-polyfill', 'react-hot-loader/patch', './src/index.tsx'],
    // 这部分不变的代码单独打包
    framework: ['react', 'react-dom']
  },
  output: {
    filename: 'js/bundle.js',
    path: outDirSrc
  },
  resolve: {
    // 设置别名
    alias: {
      '@': resolve('src'), // 这样配置后 @ 可以指向 src 目录
      pages: resolve('src/pages'),
      assets: resolve('src/assets'),
      'react-dom': '@hot-loader/react-dom'
    },
    // 省略后缀名
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx']
  },
  devtool: 'cheap-module-eval-source-map',
  // WebPack 警告WARNING in asset size limit: The following asset(s) exceed the recommended size limit (244 KiB).解决
  performance: {
    hints: 'warning', // 枚举
    maxAssetSize: 30000000, // 整数类型（以字节为单位）
    maxEntrypointSize: 50000000, // 整数类型（以字节为单位）
    assetFilter: function(assetFilename) {
      // 提供资源文件名的断言函数
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    }
  },
  plugins: [
    // 环境变量配置
    new webpack.DefinePlugin({
      'process.env': require(`./${process.env.NODE_ENV}.env`)
    })
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(ts|tsx)$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'images/',
            limit: 8192
            // 小于等于8K的图片会被转成base64编码，直接插入HTML中，减少HTTP请求。
          }
        }
      },
      {
        test: /\.(eot|ttf|svg|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name]_[hash].[ext]',
            outputPath: 'font/'
          }
        }
      }
    ]
  }
}
