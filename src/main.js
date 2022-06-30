import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import '@/styles/index.less'
// 加载动态设置REM基准值
import 'amfe-flexible'
// 导入并安装Vant组件库
import Vant from 'vant'
// 加载dayjs
import '@/utils/day'
import 'vant/lib/index.css'
Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  beforeCreate() {
    Vue.prototype.$bus = this
  },
  render: (h) => h(App)
}).$mount('#app')
