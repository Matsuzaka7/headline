<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      err-text="加载失败 , 请重试!"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, i) in list"
        :key="i"
        :title="item.title"
        is-link
        :to="{ name: 'article', params: { articleId: item.art_id } }"
      />
    </van-list>
  </div>
</template>

<script>
import { getSearchResults } from '@/api/search'
export default {
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  name: 'SearchResult',
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1,
      error: false
    }
  },
  methods: {
    async onLoad() {
      try {
        // 1.请求获取数据
        const params = {
          page: this.page, // 页码
          per_page: 20, // 每页数量
          q: this.searchText // 查询关键词
        }
        const { data } = await getSearchResults(params)
        // 将数据添加到渲染列表中
        const res = data.data.results
        this.list.push(...res)
        // 将本次加载loading关闭
        this.loading = false
        // 判断是否继续加载数据
        if (res.length) {
          // 如果继续加载 则更新获取下一页数据的页码
          this.page++
        } else {
          // 没有则取消加载状态 设置 finished 结束
          this.finished = true
        }
      } catch (error) {
        // 展示加载失败提示状态
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
