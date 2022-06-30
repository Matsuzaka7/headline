<template>
  <div class="layout-container">
    <!-- 子路由出口 -->
    <keep-alive>
      <router-view />
    </keep-alive>
    <!-- /子路由出口 -->

    <!-- 标签导航栏 -->
    <van-tabbar class="layout-tabbar" route>
      <van-tabbar-item replace icon="home-o" :to="{ name: 'home' }"
        >主页</van-tabbar-item
      >
      <van-tabbar-item replace icon="user-circle-o" to="/my">{{
        $store.state.user ? '我的' : '未登录'
      }}</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import '@/styles/index.css'
export default {
  name: 'LayoutIndex',
  data() {
    return {}
  },
  mounted() {
    // LayoutIndex组件完成渲染后 缓存起来 防止点进某篇文章后 出来后重新刷新页面
    this.$store.commit('addCachePage', 'LayoutIndex')
  }
}
</script>

<style lang="less" scoped></style>
