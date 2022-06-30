<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      @cancel="$emit('close')"
      @confirm="onConfirm"
      :default-index="value"
    />
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
      localGender: this.value,
      columns: ['男', '女']
    }
  },
  methods: {
    // 更改用户的性别
    async onUpdateGender() {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        const data = {
          gender: this.localGender
        }
        await updateUserProfile(data)
        // 提示成功
        this.$toast.success('修改成功')
        // 清除缓存
        this.$store.commit('delCachePage', 'LayoutIndex')
        // 通知父组件进行更改
        this.$emit('input', this.localGender)
        // 关闭弹出层
        this.$emit('close')
      } catch (error) {
        let msg = '发生未知错误 ! 请稍后重试'
        if (error.response && error.response.status === 400) {
          msg = '您填写的昵称有误!'
        }
        this.$toast(msg)
      }
    },
    onConfirm(value, index) {
      this.localGender = index
      this.onUpdateGender()
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.van-picker__cancel,
/deep/.van-picker__confirm {
  color: #1989fa !important;
}
</style>
