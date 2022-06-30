// 请求模块
// import { Toast } from 'vant'
import axios from 'axios'
import store from '@/store'
import JSONBig from 'json-bigint'
// import router from '@/router'
// console.log(JSON.parse(jsonStr))
// console.log(JSONBig.parse(jsonStr))
// js只能处理-2^53到2^53的数字 之外的就需要依赖插件解决 比如 json-bigint
// JSONBig.parse() 把json字符串转化为js对象
// JSONBig.stringify() 把js对象转化为JSON字符串
const request = axios.create({
  // 接口的基准路径
  baseURL: 'http://toutiao.itheima.net',
  // 自定义后端返回的原始数据 使用JSONBig解析服务器返回的数据 防止大数问题的发生
  transformResponse: [
    function (data) {
      // axios 会按我们写的代码来处理后端返回的数据
      // data就是后端返回的原始数据
      try {
        return JSONBig.parse(data)
      } catch (error) {
        return data
      }
    }
  ]
})
// 请求拦截器 所有请求都会经过此处
request.interceptors.request.use(
  (config) => {
    // 请求发起会经过这里!
    // config 配置对象: 本次请求的请求配置
    const { user } = store.state
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // 必须返回config 否则请求会停止在此处
    return config
  },
  (error) => {
    // 如果请求出错(还没有发出去) 会进入这里
    return Promise.reject(error)
  }
)
// // 响应拦截器
// request.interceptors.response.use(
//   (res) => {
//     return res
//   },
//   async (err) => {
//     // 身份认证过期
//     if (err.response.status === 401) {
//       router.push('/login')
//     }
//     return err
//   }
// )

// 响应拦截器
export default request
