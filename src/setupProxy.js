const proxy = require('http-proxy-middleware')
const { REACT_APP_PROXY_URL, REACT_APP_PROXY_BASE_RUL } = process.env

module.exports = function(app) {
  app.use(proxy('/mock', { 
    target: 'http://127.0.0.1:3001',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
    '^/mock': ''
    }
  }))
  app.use(proxy(`${REACT_APP_PROXY_URL}`, {
    target: REACT_APP_PROXY_BASE_RUL,
    secure: false,
    changeOrigin: true,
    pathRewrite: {
      [`^${REACT_APP_PROXY_URL}`]: ''
    }
  }))
}