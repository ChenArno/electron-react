/*
 * @Descripttion: 
 * @version: 
 * @Author: chenArno
 * @Date: 2019-12-13 10:55:20
 * @LastEditors: chenArno
 * @LastEditTime: 2019-12-13 11:14:58
 */
module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: ['last 5 version', '>1%', 'ie >=8']
    })
  ]
}