import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
// 加载插件
Vue.use(VueRouter)

// 路由规则数组
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
  {
    path: '/article/:articleId',
    name: 'article',
    component: () => import('@/views/article'),
    // 开启props传参
    props: true
  },
  {
    path: '/user/profile',
    name: 'userProfile',
    component: () => import('@/views/user-profile')
  },
  {
    path: '/userCollect',
    name: 'userCollect',
    props: true,
    component: () => import('@/views/User/user-collect')
  },
  {
    path: '/userHistories',
    name: 'userHistories',
    props: true,
    component: () => import('@/views/User/user-histories')
  },
  {
    path: '/chat/:name/:photo',
    name: 'chat',
    props: true,
    component: () => import('@/views/chat')
  },
  {
    path: '/userFollowers',
    name: 'userFollowers',
    props: true,
    component: () => import('@/views/User/user-followers')
  },
  {
    path: '/userFollowings',
    name: 'userFollowings',
    props: true,
    component: () => import('@/views/User/user-followings')
  },
  {
    path: '/',
    // 如果父路由是默认路由 那这个name没有意义
    // name: 'layout',
    component: () => import('@/views/layout/index'),
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () => import('@/views/home')
      },
      {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      },
      {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      },
      {
        path: '/my',
        name: 'my',
        component: () => import('@/views/my')
      }
    ]
  }
]

// 创建路由实例
const router = new VueRouter({
  routes
})

// 如果你已经登录 就不能再跳转到登录页 防止地址栏强行跳转
// beforEach 路由前置守卫
router.beforeEach((to, from, next) => {
  if (store.state.user && to.path === '/login') {
    next('/') // 留在原地
  } else {
    next() // 下一步
  }
})
export default router
