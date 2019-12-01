const { override, fixBabelImports, overrideDevServer, addPostcssPlugins, addWebpackAlias, addLessLoader } = require('customize-cra')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const paths = require('react-scripts/config/paths')
const { isProd, resolve, MODE_MULTIPLE, MODE_SINGLE } = require('./util')
const { mode, filename, publicPath, outputPath, pages, devServer = {} } = require('../react.config')

paths.appBuild = outputPath

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
