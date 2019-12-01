import axios from '@/utils/axios'

export async function proxyLogin(params: any) {
  return axios({
    url: '/login',
    method: 'POST',
    params
  })
}
export async function proxyLogout() {
  return axios({
    url: '/logout',
    method: 'POST',
  })
}