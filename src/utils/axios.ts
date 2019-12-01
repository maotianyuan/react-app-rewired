import axios from 'axios'
import { message } from 'antd'
const service = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? process.env.REACT_APP_PROXY_URL : '',
  timeout: 10000, // 请求超时时间
  withCredentials: true // 选项表明了是否是跨域请求
})

service.interceptors.request.use(config => {
  return config;
}, err => {
  return Promise.reject(err)
})
//拦截响应
service.interceptors.response.use(config => {
  return config;
}, err => {
  return Promise.reject(err)
})
// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (!res.success) {
      const { msg = '操作异常' } = res.results || {}
      message.info(msg, 2);
      return res
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export const getToken = async () => {
  let data: any = await axios({
     url: '/php/login',
     method: 'GET',
     responseType: 'text'
   })
   let token = ''
   if (/name="?token"?\s*content="?([^>\s"]+)"?/.test(data.data)) {
    token = RegExp.$1
   }
   service.interceptors.request.use(config => {
    config.headers['X-CSRF-TOKEN'] = token
    return config;
  }, err => {
    return Promise.reject(err)
  })
 }
// getToken()

export default service