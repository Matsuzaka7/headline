<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <h4>全部评论 ({{ total }})</h4>
      <CommentItem :commentItem="item" v-for="(item, i) in data" :key="i" />
    </van-list>
  </div>
</template>

<script>
import { getComments } from '@/api/comment'
import CommentItem from '@/components/Comment/comment-item'
export default {
  props: {
    // 文章id
    source: {
      type: [Number, String, Object],
      required: true
    },
    // 评论总数
    value: {
      type: [Number, String, Object]
    },
    // 所有评论数据
    data: {
      type: Array,
      default: () => []
    }
  },
  components: {
    CommentItem
  },
  name: 'CommentList',
  data() {
    return {
      list: this.data,
      loading: false,
      finished: false,
      error: false,
      // 获取下一页评论的标记
      offset: null,
      // 一次获取 limit 条评论
      limit: 10,
      // 评论总数
      total: 0
    }
  },
  created() {
    this.onLoad()
  },
  updated() {
    // 监听发布评论后子组件发送过来的信号 重新获取数据
    this.$bus.$on('update-comment-list', () => {
      this.onLoad()
    })
  },
  methods: {
    async onLoad() {
      try {
        const params = {
          // 评论类型,a-对文章(article)的评论,c-对评论(comment)的回复
          type: 'a',
          // 源id,文章id或评论id
          source: this.source,
          // 非必传 获取评论数据的偏移量,值为评论id,表示从此id的数据向后取,不传表示从第一页开始读取数据
          offset: this.offset,
          // 非必传 获取的评论数据个数,不传表示采用后端服务设定的默认每页数据量
          limit: this.limit
        }
        // 请求获取数据
        const { data } = await getComments(params)
        const { results, total_count: total } = data.data
        this.total = total
        // 将数据加载到列表中
        this.list.push(...results)
        // 把文章总评论数传递给外界
        this.$emit('input', this.total)
        // 将loading设置为false
        this.loading = false
        // 判断是否还有数据
        if (results.length) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id
        } else {
          // 没有就将finished设置为true
          this.finished = true
        }
      } catch (error) {
        this.error = true
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
h4 {
  margin-top: 10px;
  margin-bottom: 30px;
  font-weight: 500;
  font-size: 50px;
}
</style>
