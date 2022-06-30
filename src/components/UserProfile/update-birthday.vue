<template>
  <div>
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="出生日期"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onUpdateBirthday"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  props: {
    value: {
      type: [Number, String, Object],
      required: true
    }
  },
  data() {
    return {
      // 选择的最小事件
      minDate: new Date(1900, 0, 1),
      // 选择的最大时间
      maxDate: new Date(),
      // 默认选择时间
      currentDate: new Date(this.value)
    }
  },
  methods: {
    // 更改用户的出生日期
    async onUpdateBirthday() {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      // 使用dayjs对数据进行转换
      const currentDate = dayjs(this.currentDate).format('YYYY-MM-DD')
      try {
        const data = {
          birthday: currentDate
        }
        await updateUserProfile(data)
        // 提示成功
        this.$toast.success('修改成功')
        // 清除缓存
        this.$store.commit('delCachePage', 'LayoutIndex')
        // 通知父组件进行更改
        this.$emit('input', currentDate)
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
/deep/.van-picker__cancel,
/deep/.van-picker__confirm {
  color: #1989fa !important;
}
</style>
