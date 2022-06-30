<template>
  <van-button
    class="follow-btn"
    :type="value ? 'default' : 'info'"
    size="small"
    round
    :loading="followLoading"
    @click="onFollow"
  >
    <slot>
      {{ value ? '已关注' : '关注' }}
    </slot>
  </van-button>
</template>

<script>
import { addFollow, delFollow } from '@/api/user'
export default {
  props: {
    value: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [Number, String, Object],
      required: true
    }
  },
  name: 'FollowUser',
  data() {
    return {
      followLoading: false
    }
  },
  methods: {
    // 关注与取消关注用户
    async onFollow() {
      // 展示关注按钮的loading状态
      this.followLoading = true
      try {
        if (this.value) {
          // 取消关注用户
          await delFollow(this.userId)
          this.$toast('取消关注')
        } else {
          // 关注用户
          await addFollow(this.userId)
          this.$toast('关注成功')
        }
        // v-model的默认事件 会自动监听
        this.$emit('input', !this.value)
      } catch (error) {
        let msg = '发生未知错误 ! 请稍后重试'
        if (error.response && error.response.status === 400) {
          msg = '你不能关注你自己!'
        } else if (error.response && error.response.status === 401) {
          msg = '您尚未登录!'
        }
        this.$toast(msg)
      }
      // 关闭关注按钮的loading状态
      this.followLoading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
