<template>
  <div class="update-name">
    <!-- 导航栏 -->
    <van-nav-bar
      title="昵称"
      left-text="取消"
      right-text="完成"
      @click-left="$emit('close')"
      @click-right="onUpdateName"
    />
    <!-- 输入框 -->
    <div class="field-wrap">
      <van-field
        v-model.trim="localName"
        rows="2"
        autosize
        type="textarea"
        maxlength="7"
        placeholder="请输入新昵称~"
        show-word-limit
      />
    </div>
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  props: {
    value: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      localName: this.value
    }
  },
  methods: {
    // 更改用户的name
    async onUpdateName() {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        if (!this.localName.length) {
          this.$toast('昵称不能为空!')
          return
        }
        const data = {
          name: this.localName
        }
        await updateUserProfile(data)
        // 提示成功
        this.$toast.success('修改成功')
        // 清除缓存 防止更改昵称后返回 我的页面 昵称没有刷新
        this.$store.commit('delCachePage', 'LayoutIndex')
        // 通知父组件进行更改
        this.$emit('input', this.localName)
        // 关闭弹出层
        this.$emit('close')
      } catch (error) {
        let msg = '发生未知错误 ! 请稍后重试'
        if (error.response && error.response.status === 400) {
          msg = '您填写的昵称有误!'
        }
        this.$toast(msg)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.field-wrap {
  padding: 25px;
}
</style>
