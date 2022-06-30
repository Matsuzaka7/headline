<template>
  <div>
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="阅读历史"
    ></van-nav-bar>
    <van-list
      v-if="!isNoData"
      class="van-list"
      :immediate-check="false"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败 , 点击重新加载"
    >
      <ArticleItem v-for="(item, i) in list" :key="i" :article="item" />
    </van-list>
    <!-- 暂无数据 -->
    <NoData v-else />
  </div>
</template>

<script>
import { getUserHistories } from '@/api/user'
import ArticleItem from '@/components/Article/article-item'
import NoData from '@/components/NoData'
export default {
  name: 'userCollect',
  components: {
    ArticleItem,
    NoData
  },
  data() {
    return {
      list: [],
      // 控制加载中loading状态
      loading: false,
      // 控制数据加载是否结束
      finished: false,
      // 控制列表加载是否失败
      error: false,
      // 是否有数据
      isNoData: null
    }
  },
  methods: {
    async loadUserHistories() {
      if (!this.$store.state.user) {
        this.$toast('您尚未登录!')
        this.$router.push('/login')
        return
      }
      this.$toast.loading({
        message: '加载中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        const { data } = await getUserHistories()
        const { results } = data.data
        this.list.push(...results)
        // 本次数据加载结束后要把加载状态设置为 结束
        this.loading = false
        this.finished = true
        this.$toast('加载完成 !')
        if (this.list.length === 0) {
          this.isNoData = true
        } else {
          this.isNoData = false
        }
      } catch (error) {
        this.$toast('发生未知错误 ! 请重试')
      }
    }
  },
  created() {
    this.loadUserHistories()
  }
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  background-color: #3395fc;
  .van-nav-bar__title {
    color: white;
  }
  .van-icon {
    color: white;
  }
}
/deep/.van-list {
  padding-top: 92px;
}
</style>
