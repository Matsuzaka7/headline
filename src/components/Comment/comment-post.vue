<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      type="textarea"
      label=""
      rows="2"
      autosize
      maxlength="50"
      placeholder="说点什么~"
      show-word-limit
      v-model.trim="msg"
      :autofocus="'true'"
    />
    <van-button
      class="post-btn"
      :disabled="!msg.length"
      :loading="loading"
      @click="onComment"
      >发表评论</van-button
    >
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  props: ['target'],
  name: 'CommentPost',
  data() {
    return {
      // 输入的评论
      msg: '',
      // 按钮状态
      loading: false
    }
  },
  methods: {
    async onComment() {
      this.loading = true
      try {
        const { data } = await addComment({
          // 评论的目标id(评论文章即为文章id,对评论进行回复则为评论id)
          target: this.target,
          // 评论内容
          content: this.msg,
          // 文章id,对评论内容发表回复时,需要传递此参数,表明所属文章id.对文章进行评论,不要传此参数.
          art_id: null
        })
        this.$toast.success('发布成功')
        // 关闭弹出层和评论视图都在外界 所以需要去父组件进行操作
        this.$emit('postSuccess', data.data)
        // 清空文本框
        this.msg = ''
      } catch (error) {
        let msg = '发生未知错误 ! 请稍后重试'
        if (error.response && error.response.status === 401) {
          msg = '您尚未登录!'
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
.comment-post {
  padding: 25px;
  display: flex;
  align-items: center;
  .post-field {
    background-color: #f3f5f7;
    color: #999;
    font-size: 28px;
  }
  .post-btn {
    font-size: 30px;
    width: 200px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    text-align: center;
    &::before {
      display: none;
    }
  }
}
</style>
