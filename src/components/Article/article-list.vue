<template>
  <div class="article-list" ref="article-list">
    <van-pull-refresh
      v-model="refreshing"
      @refresh="onRefresh"
      success-text="刷新成功"
      success-duration="600"
    >
      <van-list
        :immediate-check="false"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了, o(╥﹏╥)o"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败 , 点击重新加载"
        @refresh="onRefresh"
      >
        <ArticleItem v-for="(item, i) in list" :key="i" :article="item" />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { getArticle } from '@/api/article'
import ArticleItem from './article-item'
import { debounce } from 'lodash'
export default {
  props: {
    channel: {
      type: Object,
      required: true
    }
  },
  components: {
    ArticleItem
  },
  name: 'ArticleList',
  data() {
    return {
      // 存储数据
      list: [],
      // 控制加载中loading状态
      loading: false,
      // 控制数据加载是否结束
      finished: false,
      // 控制列表加载是否失败
      error: false,
      // 控制下拉刷新状态
      refreshing: false,
      // 请求页码的时间戳
      timestamp: null,
      // 文章列表的滚动高度
      scrollTop: 0
    }
  },
  methods: {
    // 初始化或滚动到底部会触发 onLoad
    async onLoad() {
      // 1.请求获取数据
      try {
        const { data } = await getArticle({
          // 请求频道的 id
          channel_id: this.channel.id,
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据 : 当前最新时间戳
          // 请求之后数据的时间戳会在当前请求结果中返回
          timestamp: this.timestamp || Date.now()
        })
        const { results } = data.data
        // 2.把服务器返回的数据放到list数组内
        // 判断是否通过下拉刷新调用的onLoad
        if (this.refreshing) {
          // 通过下拉刷新调用的 onLoad 则需要清空原来数据
          this.list = []
        }
        // ... 数组的展开操作 它会把数组元素一个一个拿出来
        this.list.push(...results)
        // 3.本次数据加载结束后要把加载状态设置为 结束
        this.loading = false
        // 将下拉刷新的状态设置为false
        this.refreshing = false
        // 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 没有数据了 将finished设置为true
          this.finished = true
        }
      } catch (error) {
        // 展示错误提示
        this.error = true
        // 关闭加载
        this.loading = false
      }
    },
    // 当下拉刷新的时候会调用该函数
    onRefresh() {
      // 重新加载数据
      // 将 loading 设置为 true,表示处于加载状态
      this.loading = true
      this.onLoad()
    }
  },
  created() {
    this.onLoad()
  },
  mounted() {
    // 记录文章列表的滚动高度
    const articleList = this.$refs['article-list']
    // 防抖 每50毫秒后页面滚动一次就记录下scrollTop
    articleList.onscroll = debounce(() => {
      this.scrollTop = articleList.scrollTop
    }, 50)
  },
  // 每当组件从缓存中被激活的时候就会调用该函数
  activated() {
    // 让article-list的滚动高度等于scrollTop
    this.$refs['article-list'].scrollTop = this.scrollTop
  }
}
</script>

<style lang="less" scoped>
.article-list {
  height: 79vh;
  overflow-y: auto;
}
</style>
