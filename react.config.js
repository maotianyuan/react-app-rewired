const { REACT_APP_OUTPUT_PATH, REACT_APP_VIEWS_PATH, REACT_APP_OUTPUT_PUBLIC_PATH } = process.env
const { isProd, resolve, MODE_MULTIPLE } = require('./config/util')

module.exports = {
  mode: MODE_MULTIPLE, // MODE_MULTIPLE 多页面; MODE_SINGLE 单页面；
  publicPath:  isProd ? REACT_APP_OUTPUT_PUBLIC_PATH : '/', // 或者 package.json 配置 homepage // 打包路径
  outputPath: isProd ?resolve(REACT_APP_OUTPUT_PATH) : undefined, // 打包路径 修改路径后，public 依然打包到 build 路径
  filename: isProd ? resolve(REACT_APP_VIEWS_PATH, 'test.blade.php') : 'index.html', // TODO: mode = single 时候，需要这个参数, 默认值 index.html
  pages: [
    {
      name: 'index',
      title: '前台',
      filename: resolve(REACT_APP_VIEWS_PATH, 'index.blade.php'),
    },
    {
      name: 'admin',
      title: '后台',
      filename: resolve(REACT_APP_VIEWS_PATH, 'admin.blade.php'),
    },
  ], // TODO: mode = multiple 需要这个参数
  devServer: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin/, to: '/admin.html' }
      ]
    }
  }
}