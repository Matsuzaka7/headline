<template>
  <van-button
    :class="{ liked: value === 1 }"
    :icon="value === 1 ? 'good-job' : 'good-job-o'"
    :loading="loading"
    @click="onLike"
  />
</template>

<script>
import { addLike, delLike } from '@/api/article'
export default {
  props: {
    value: {
      type: [Number, String, Object],
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  name: 'ArticleLike',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onLike() {
      this.loading = true
      try {
        if (this.value === 1) {
          // 取消文章点赞
          await delLike(this.articleId)
        } else {
          // 点赞文章
          await addLike(this.articleId)
        }
        // -1为没有点赞的状态 1为点赞状态
        this.$emit('input', this.value === 1 ? -1 : 1)
        // 数据内部不做更改 所以需要取反
        this.$toast(this.value !== 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        let msg = '发生未知错误 ! 请稍后重试'
        if (error.response && error.response.status === 401) {
          msg = '认证过期或未登录 请登录 !'
          this.$router.push('/login')
        }
        this.$toast(msg)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>
