import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storeage'
Vue.use(Vuex)
const tokenKey = 'toutiao-user'
export default new Vuex.Store({
  state: {
    // 一个对象 存储当前登录用户的信息(token等数据)
    user: getItem(tokenKey),
    // 缓存的页面
    cachePages: ['LayoutIndex']
  },
  getters: {},
  mutations: {
    setUser(state, data) {
      state.user = data
      // 为了防止数据丢失 需要把数据存储到本地存储内
      setItem(tokenKey, state.user)
    },
    // 添加缓存页面
    addCachePage(state, data) {
      // 判断是否已经缓存这个页面 没有则缓存 否则不执行操作
      if (!state.cachePages.includes(data)) {
        state.cachePages.push(data)
      }
    },
    // 删除缓存页面
    delCachePage(state, data) {
      // 判断cachePages是否包含要删除的缓存页面 包含则删除 否则不执行操作
      const i = state.cachePages.indexOf(data)
      if (i !== -1) {
        state.cachePages.splice(i, 1)
      }
    }
  },
  actions: {},
  modules: {}
})
