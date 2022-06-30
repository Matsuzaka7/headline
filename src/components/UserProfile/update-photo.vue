<template>
  <div class="update-photo">
    <img :src="img" ref="img" class="img" alt="" />
    <!-- 底部 -->
    <div class="toolbar">
      <div @click="$emit('close')">取消</div>
      <div @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserImg } from '@/api/user'
export default {
  props: ['img'],
  data() {
    return {
      cropper: null
    }
  },
  mounted() {
    this.cropper = new Cropper(this.$refs.img, {
      // 裁剪框比例
      aspectRatio: 1,
      // 裁剪框模式
      viewMode: 1,
      // 拖动模式
      dragMode: 'move',
      // 默认裁剪框的比例
      autoCropArea: 1,
      // 画布是否可以移动
      movable: true,
      // 控制背景
      background: false,
      // 是否可以移动裁剪框
      cropBoxMovable: false,
      // 是否可以缩放裁剪框
      cropBoxResizable: false
    })
  },
  methods: {
    onConfirm() {
      this.$toast.loading({
        message: '修改中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      // 基于服务端的裁切使用 getData 获取裁切的参数
      // console.log(this.cropper.getData())

      // 纯客户端的裁切使用 getCroppedCanvas 获取裁切的文件对象
      // console.log(this.cropper.getCroppedCanvas())

      // 转化为Blob参数发送给服务端
      this.cropper.getCroppedCanvas().toBlob(async (blob) => {
        // 如果接口要求 Content-Type 参数是 multipart/form-data 类型
        // 则必须传递一个 FormData 对象
        // 如果接口要求 Content-Type 参数是 application/json 类型
        // 则传递一个普通 JavaScript 对象
        const formData = new FormData()
        // 将属性 photo 追加到 formData 对象里 值为blob
        formData.append('photo', blob)
        try {
          const { data } = await updateUserImg(formData)
          // 提示成功
          this.$toast.success('修改成功')
          // 清除缓存
          this.$store.commit('delCachePage', 'LayoutIndex')
          // 通知父组件进行更改
          this.$emit('updateUserPhoto', data.data.photo)
          // 关闭弹出层
          this.$emit('close')
        } catch (error) {
          this.$toast('发生未知错误 请稍后重试!')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    font-size: 35px;
    padding: 20px;
    color: white;
  }
}
.img {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: block;
  max-width: 100%;
}
</style>
