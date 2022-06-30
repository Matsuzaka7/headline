<template>
  <van-cell class="comment-item">
    <van-image
      slot="icon"
      :src="commentItem.aut_photo"
      class="avtar"
      round
      fit="cover"
    />

    <div class="title-wrap" slot="title">
      <div class="user-name">{{ commentItem.aut_name }}</div>
      <van-button
        class="like-btn"
        @click="onCommentLike(commentItem)"
        :class="{ liked: commentItem.is_liking }"
        size="small"
        :loading="loading"
        :icon="commentItem.is_liking ? 'good-job' : 'good-job-o'"
        >{{
          commentItem.like_count > 0 ? commentItem.like_count : '赞'
        }}</van-button
      >
    </div>

    <div slot="label" class="box">
      <p class="comment-content">{{ commentItem.content }}</p>
      <div class="bottom-info">
        <span class="comment-pubdate">{{
          commentItem.pubdate | relativeTime
        }}</span>
        <van-button
          size="small"
          round
          class="reply-btn"
          @click="$toast('此功能暂未开放 ! ')"
          >点此回复</van-button
        >
      </div>
    </div>
  </van-cell>
</template>

<script>
import { addCommentLike, delCommentLike } from '@/api/comment'
export default {
  props: ['commentItem'],
  name: 'CommentItem',
  data() {
    return {
      // commentItem: this.comment,
      loading: false
    }
  },
  methods: {
    async onCommentLike(commentItem) {
      this.loading = true
      try {
        if (commentItem.is_liking) {
          // 已经对评论点赞 取消点赞
          await delCommentLike(commentItem.com_id)
        } else {
          // 评论点赞
          const data = { target: commentItem.com_id }
          await addCommentLike(data)
        }
        // 评论点赞数量+1或-1
        commentItem.is_liking
          ? commentItem.like_count--
          : commentItem.like_count++
        this.$toast(commentItem.is_liking ? '取消点赞' : '点赞成功')
        // 更新视图
        commentItem.is_liking = !this.commentItem.is_liking
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
.comment-item {
  .avtar {
    width: 72px;
    height: 72px;
    margin-right: 25px;
  }
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .user-name {
      color: #406599;
      font-size: 30px;
    }

    .like-btn {
      color: #222;
      border: none;
    }
    .liked {
      .van-icon {
        color: #e5645f;
      }
    }
  }
  .comment-content {
    margin: 10px 0;
    font-size: 32px;
    color: #222222;
    word-break: break-all;
    text-indent: 15px;
  }
  .comment-pubdate {
    font-size: 22px;
    color: #999;
    margin-right: 25px;
  }
  .bottom-info {
    display: flex;
    align-items: center;
  }

  .reply-btn {
    margin-top: 5px;
    width: 180px;
    line-height: 49px;
    font-size: 23px;
    color: #222;
    border: none;
  }
}
</style>
