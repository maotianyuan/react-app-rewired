# react-app-rewired 多页面、单页面配置

## 背景
使用 create-react-app 脚手架命令来搭建项目，项目一般由前后台两端，所以需要两个入口，故需要 create-react-app 支持多页面的配置，
又因为，不想执行 npm run eject 命令，
故使用 react-app-rewired 修改脚手架配置，在项目中安装 react-app-rewired 后，可以通过创建一个 config-overrides.js 文件来对 webpack 配置进行扩展。

## 展示效果
```js
npm run start // 查看
```
- [前台登陆](http://localhost:300/#/login)
- [后台登陆](http://localhost:3000/admin/#/login)

 
## 配置 react.config.js
- 单页面
```js
const { REACT_APP_OUTPUT_PATH, REACT_APP_VIEWS_PATH, REACT_APP_OUTPUT_PUBLIC_PATH } = process.env
const { isProd, resolve, MODE_MULTIPLE } = require('./config/util')

module.exports = {
  mode: MODE_SINGLE,
  publicPath:  isProd ? REACT_APP_OUTPUT_PUBLIC_PATH : '/', // 或者 package.json 配置 homepage // 打包路径
  outputPath: isProd ?resolve(REACT_APP_OUTPUT_PATH) : undefined, // 打包路径 修改路径后，public 依然打包到 build 路径
  filename: isProd ? resolve(REACT_APP_VIEWS_PATH, 'test.blade.php') : 'index.html', // TODO: mode = single 时候，需要这个参数, 默认值 index.html
}
```

- 多页面
```js
const { REACT_APP_OUTPUT_PATH, REACT_APP_VIEWS_PATH, REACT_APP_OUTPUT_PUBLIC_PATH } = process.env
const { isProd, resolve, MODE_MULTIPLE } = require('./config/util')

module.exports = {
  mode: MODE_MULTIPLE,
  publicPath:  isProd ? REACT_APP_OUTPUT_PUBLIC_PATH : '/', // 或者 package.json 配置 homepage // 打包路径
  outputPath: isProd ?resolve(REACT_APP_OUTPUT_PATH) : undefined, // 打包路径 修改路径后，public 依然打包到 build 路径
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
```

## 核心配置文件
- 见 config/config-overrides.js, 路径配置在 package.json  "config-overrides-path": "config/config-overrides.js"
```js
const { override, fixBabelImports, overrideDevServer, addPostcssPlugins, addWebpackAlias, addLessLoader } = require('customize-cra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const paths = require('react-scripts/config/paths')
const { isProd, resolve, MODE_MULTIPLE, MODE_SINGLE } = require('./util')
const { mode, filename, publicPath, outputPath, pages, devServer = {} } = require('../react.config')

paths.appBuild = outputPath

// 多页面 配置的多入口
function getEntries(){
  let entries = {}
  pages.map(({ name = 'index' }) => {
    entries[name] = [
      require.resolve('react-app-polyfill/stable'),
      resolve('src', name, 'index.tsx')
    ]
    !isProd && entries[name].splice(1, 0, require.resolve('react-dev-utils/webpackHotDevClient'))
  })
  return entries;
}
// 多页面 配置的多入口 的 HtmlWebpackPlugin
function getHtmlPlugin () {
  let htmlPlugin = null
  htmlPlugin = pages.map(item => {
    let { name, title, filename } = item
    let minify = isProd ? {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    } : { }
    return new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      title,
      filename: isProd ? filename : `${name}.html`,
      chunks: [name],
      ...minify
    })
  })
  return htmlPlugin
}
// 多页面 配置的多入口 的 config.plugins
function setConfigPlugins (config) {
  const htmlPlugin = getHtmlPlugin()
  if (isProd) {
    for (let i = 0; i < config.plugins.length; i++) {
      let item = config.plugins[i]
      // 更改输出的样式文件名
      if (item.constructor.toString().indexOf('class MiniCssExtractPlugin') > -1) {
        item.options.filename = 'static/css/[name].css?_v=[contenthash:8]'
        item.options.chunkFilename = 'static/css/[name].chunk.css?_v=[contenthash:8]'
      }
      // SWPrecacheWebpackPlugin: 使用 service workers 缓存项目依赖
      if(item.constructor.toString().indexOf('function GenerateSW') > -1){
        // 更改输出的文件名
        item.config.precacheManifestFilename = 'precache-manifest.js?_v=[manifestHash]'
      }
    }
    // 更改生产模式输出的文件名
    config.output.filename = 'static/js/[name].js?_v=[chunkhash:8]'
    config.output.chunkFilename = 'static/js/[name].chunk.js?_v=[chunkhash:8]'
  } else {
    // 更改开发模式输出的文件名
    config.output.filename = 'static/js/[name].js'
    config.output.chunkFilename = 'static/js/[name].chunk.js'
  }
  for (let i = 0; i < config.plugins.length; i++) {
    let item = config.plugins[i];
    if (item.constructor.toString().indexOf('class HtmlWebpackPlugin') > -1) {
      config.plugins.splice(i, 1);
    }
  }
  config.plugins.push(...htmlPlugin)
}

module.exports = {
  webpack: override(
    fixBabelImports('import', {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true,
    }),
    addWebpackAlias({
      '@': path.resolve(__dirname, '../src'),
      '@utils': path.resolve(__dirname, '../src/utils'),
    }),
    addLessLoader({
      javascriptEnabled: true,
      modifyVars: {
        '@primary-color': '#1DA57A'
      }
    }),
    addPostcssPlugins ([
      require('autoprefixer'),
      require('stylelint')
    ]),
    (config) => {
      if (mode === MODE_MULTIPLE) {
        if (!pages) {
          console.error('！！！！！！您需要配置 pages 参数！！！！\n')
          return
        }
        const entries = getEntries()
        config.entry = entries
        setConfigPlugins(config)
      } else if (mode === MODE_SINGLE) {
        let { options } = config.plugins[0]
        options.filename = filename || 'index.html'
      }
      config.output.path = outputPath
      config.output.publicPath = publicPath
      config.module.rules[2].oneOf[5].exclude = 
      [
        /\.module\.(scss|sass)$/,
        path.resolve(__dirname, '../src/assets/styles')
      ]
      config.module.rules[2].oneOf[5].use[1] = {
        loader: 'typings-for-css-modules-loader',
        options: {
          modules: true,
          namedExport: true,
          camelCase: true,
          sass: true
        }
      }
      config.module.rules[2].oneOf[5].use.push({
        loader: 'sass-resources-loader',
        options: {
          resources: [
            'src/assets/styles/variables.scss',
            'src/assets/styles/mixins.scss'
          ]
        }
      })
      return config
    }
  ),
  devServer: overrideDevServer(
    (config) => {
      return {
        ...config,
        ...devServer
      }
    }
  )
}
```

# 踩坑
react-scripts 版本需要是 3.0.1

# 参考
- [React-CRA - react-app-eject - 多页面配置](https://segmentfault.com/a/1190000016960824#item-6)
- [React-CRA - react-app-rewired - 多页面配置](https://segmentfault.com/a/1190000017858725)
- [React-CRA - react-app-rewired - 多页面配置 - git 例子](https://github.com/sofn/react-ts-multientry)
- [customize-cra] (https://github.com/arackaf/customize-cra#overview)