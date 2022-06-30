<template>
  <van-button
    @click="onCollect"
    :loading="loading"
    :icon="value ? 'star' : 'star-o'"
    :class="{ collected: value }"
  />
</template>

<script>
import { addCollect, delCollect } from '@/api/article'
export default {
  props: {
    // 接收v-model传过来的值
    value: {
      type: Boolean,
      required: true
    },
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  name: 'ArticleCollect',
  data() {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect() {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏 取消收藏
          await delCollect(this.articleId)
        } else {
          // 添加收藏
          await addCollect(this.articleId)
        }
        // v-model监听事件 它并不是立即的
        this.$emit('input', !this.value)
        // 数据内部不做更改 所以需要取反
        this.$toast(!this.value ? '收藏成功' : '取消收藏')
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
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>
