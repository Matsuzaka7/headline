import dayjs from 'dayjs'
import Vue from 'vue'
import relativeTime from 'dayjs/plugin/relativeTime'
// dayjs默认配置为英文 手动配置为中文
import 'dayjs/locale/zh-cn'
// 全局加载中文包
dayjs.locale('zh-cn')
// 配置处理相对时间的插件
dayjs.extend(relativeTime)
// 定义一个全局过滤器 可以在任何组件内使用
// 这个过滤器就相当于全局可用的方法 但只限模板使用
Vue.filter('relativeTime', (time) => {
  return dayjs().from(time)
})
// datjs() 获取当前最新时间
// dayjs().format('YYYY-MM-DD')
