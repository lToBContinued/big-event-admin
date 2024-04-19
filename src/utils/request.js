import axios from 'axios'
import { useUserStore } from '@/stores/index.js'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseUrl = 'http://big-event-vue-api-t.itheima.net'
const instance = axios.create({
  // 1. 基础地址，超时时间
  baseUrl,
  timeout: 5000
})

// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    // 2. 携带 Token
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  (res) => {
    // 3. 业务处理成功
    if (res.data.code === 0) {
      return res
    }
    // 4. 业务处理失败，给错误提示，抛出错误
    ElMessage.error(res.data.message || '服务器异常')
    return Promise.reject(res.data)
  },
  (error) => {
    // 对响应错误做点什么
    // 超出 2xx 范围的状态码都会触发该函数。
    // 5. 错误的默认情况
    ElMessage.error(error.response.data.message || '服务器异常')

    // 5. 处理401错误，权限不足或token过期，拦截到登录页面
    if (error.response?.status === 401) {
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

export default instance
export { baseUrl }
