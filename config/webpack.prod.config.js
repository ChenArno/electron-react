/*
 * @Descripttion:
 * @version:
 * @Author: chenArno
 * @Date: 2019-12-12 14:59:29
 * @LastEditors: chenArno
 * @LastEditTime: 2020-04-03 10:10:55
 */
const { outDirSrc } = require('./utils')
const path = require('path')
const merge = require('webpack-merge')
const common = require('./webpack.common.config')
const theme = require('./theme')
// 打包编译前清理dist目录
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// 压缩插件
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
// 拷贝文件
const CopyWebpackPlugin = require('copy-webpack-plugin')
// 打包独立的css插件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// gzip压缩
const CompressionWebpackPlugin = require('compression-webpack-plugin')

const webpackProdConfig = merge(common, {
  mode: 'production',
  output: {
    filename: 'js/[name].[chunkhash:8].bundle.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // filename：打包之后的html文件名字
      // public/index.html无论与要用的template是不是在一个目录，都是从根路径开始查找
      template: 'public/index.html', // template：以我们自己定义的html为模板生成
      inject: 'body', // inject：在body最底部引入js文件，如果是head，就是在head中引入js
      minify: {
        // minify：压缩html文件
        removeComments: true, // 移除HTML中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联css
      },
      title: 'Hello wrt-cli'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: outDirSrc,
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, '../main'),
        to: outDirSrc,
        ignore: ['.*']
      }
    ]),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[hash].css',
      chunkFilename: 'css/[id].[hash].css'
    }),
    new CompressionWebpackPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.html$|\.css$/, //匹配文件名
      threshold: 10240, //对超过10k的数据压缩
      minRatio: 0.8,
      deleteOriginalAssets: false //不删除源文件
    })
  ],
  optimization: {
    moduleIds: 'hashed', // 该配置项可以指定使用某一种算法来生成模块ids,短hash ids，长期缓存表现更好
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          },
          sourceMap: true,
          parallel: true //使用多进程并行运行来提高构建速度
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          preset: [
            'default',
            {
              discardComments: {
                removeAll: true
              }
            }
          ],
          canPrint: false
          // 表示插件能够在console中打印信息，默认值是true
        }
      })
    ],
    // 公有模块
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      cacheGroups: {
        framework: {
          test: 'framework',
          name: 'framework',
          enforce: true
        },
        vendors: {
          priority: -10,
          test: /node_modules/,
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader']
      },
      {
        test: /\.less$/,
        include: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'less-loader',
            // 自定义主题
            options: {
              sourceMap: true,
              modifyVars: theme,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
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
            loader: 'less-loader',
            // 自定义主题
            options: {
              sourceMap: true,
              modifyVars: theme,
              javascriptEnabled: true
            }
          }
        ]
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
          'postcss-loader'
        ]
      }
    ]
  }
})

module.exports = webpackProdConfig
