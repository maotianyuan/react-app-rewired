const path = require('path')

module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  resolve: function resolve () {
    return path.join(__dirname, '../',  ...Array.from(arguments))
  },
  MODE_MULTIPLE: 'multiple', // 多页面
  MODE_SINGLE: 'single', // 单页面
}