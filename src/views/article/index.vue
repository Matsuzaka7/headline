<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="articleNav"
      @click-left="$router.back()"
      title="文章详情"
      left-arrow
    >
    </van-nav-bar>

    <!-- 加载 -->
    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>疯狂加载中...</van-loading>
      </div>

      <!-- 加载成功: 文章内容 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h4 class="article-title">{{ article.title }}</h4>
        <!-- 用户信息 -->
        <van-cell ref="author" class="author user-cell" center :border="false">
          <div class="base-info">
            <van-image
              round
              width="1rem"
              height="1rem"
              fit="cover"
              :src="article.aut_photo"
            />
            <div class="text">
              <p class="name">{{ article.aut_name }}</p>
              <p class="time">{{ article.pubdate | relativeTime }}</p>
            </div>
            <!-- 在组件上使用v-model绑定的参数 子组件必须用value接收 子组件更改value传给父组件可以使用this.$emit('input')事件 v-model会自动监听此事件 -->
            <FollowUser
              class="follow-btn"
              v-model="article.is_followed"
              :userId="article.aut_id"
            />
          </div>
        </van-cell>
        <!-- 文章正文 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <!-- 文章评论 -->
        <CommentList
          ref="commentList"
          :source="article.art_id"
          :data="commentList"
          v-model="commentTotal"
        />
        <!-- 底部区域 -->
        <div class="article-footer">
          <van-button
            class="onComment"
            icon="edit"
            type="default"
            @click=";(isPostShow = true), onCommentList()"
            >写评论</van-button
          >
          <van-icon
            name="comment-o"
            @click="onCommentList"
            :info="commentTotal"
            color="#777"
          />
          <ArticleCollect
            :articleId="article.art_id"
            class="btn-item"
            v-model="article.is_collected"
          />
          <ArticleLike
            v-model="article.attitude"
            :articleId="article.art_id"
            class="btn-item"
          />
          <van-icon
            name="share-o"
            @click="$toast('此功能暂未开放 ! ')"
            color="#777777"
          />
        </div>
      </div>

      <!-- 加载失败 : 404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除!</p>
      </div>

      <!-- 加载失败 : 其他未知错误(例如网络原因或服务器异常) -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败!</p>
        <van-button type="info" @click="loadArticle">点击重试</van-button>
      </div>

      <!-- 发布评论 -->
      <van-popup v-model="isPostShow" position="bottom"
        ><CommentPost @postSuccess="onPostSuccess" :target="article.art_id"
      /></van-popup>
    </div>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import FollowUser from '@/components/FollowUser'
import ArticleCollect from '@/components/Article/article-collect'
import ArticleLike from '@/components/Article/article-like'
import CommentList from '@/components/Comment/comment-list'
import CommentPost from '@/components/Comment/comment-post'
export default {
  props: ['articleId'],
  name: 'ArticleIndex',
  components: {
    FollowUser,
    ArticleCollect,
    ArticleLike,
    CommentList,
    CommentPost
  },
  data() {
    return {
      // 文章
      article: {},
      // 加载中的loading状态
      loading: true,
      // 失败的状态码(404,其他)
      errStatus: 0,
      // 评论总数
      commentTotal: 0,
      // 发布评论弹出层状态
      isPostShow: false,
      // 评论数据
      commentList: []
    }
  },
  methods: {
    // 初始化文章详情
    async loadArticle() {
      this.loading = true
      try {
        const { data } = await getArticleById(this.articleId)
        // 数据驱动视图不是立即的
        this.article = data.data
        // 初始化图片点击预览
        setTimeout(() => {
          this.previewImage()
        }, 0)
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      // 无论成功失败都需要关闭loading
      this.loading = false
    },
    // 点击图片预览
    previewImage() {
      // 得到所有正文内容
      const articleContent = this.$refs['article-content']
      // 得到所有的img节点
      const imgs = articleContent.querySelectorAll('img')
      const images = []
      // 遍历img节点
      imgs.forEach((item, i) => {
        // 把图片链接地址推送到images
        images.push(item.src)
        // 给图片绑定点击事件
        item.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组 也就是上面const的images
            images,
            // 起始位置索引
            startPosition: i
          })
        }
      })
    },
    // 跳转到评论区
    onCommentList() {
      const Y = this.$refs.commentList.$children[0].$el.children[0].offsetTop
      document.querySelector('.main-wrap').scrollTop = Y
    },
    // 评论成功后的回调函数
    onPostSuccess(data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      // 因为浅拷贝的特性 所以commentList和子组件内的list都是共享的一个地址值 一方更改 全都会改变
      this.commentList.unshift(data.new_obj)
    }
  },
  created() {
    this.loadArticle()
  }
}
</script>

<style lang="less" scoped>
@import './github-markdown.css';
body {
  background-color: #f7f8fa;
}
.article-container {
  height: 100%;
  overflow: scroll;
  background: #fff;
  /deep/.articleNav {
    background-color: #3395fc;
    .van-nav-bar__title,
    .van-icon-arrow-left {
      color: white;
    }
  }
  .main-wrap {
    position: absolute;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      margin: 40px 0;
      font-size: 50px;
    }
    // 发布作者区域
    .author {
      margin-bottom: 30px;
      padding: 10px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .base-info {
        display: flex;
        align-items: center;
      }
      .text {
        flex: 1;
        padding-left: 10px;
        line-height: 1.3;
        .name {
          font-size: 28px;
          margin: 0;
        }
        .time {
          margin: 0;
          font-size: 22px;
          color: #999;
        }
      }
    }
    .article-detail {
      padding: 10px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .markdown-body {
      padding-bottom: 50px;
    }
  }
  .follow-btn {
    width: 160px;
  }
  // 底部区域
  .article-footer {
    display: flex;
    position: fixed;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: space-around;
    align-items: center;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .van-button {
      flex: 2;
      color: #999;
    }
    .btn-item {
      border: none;
      color: #777777;
      flex: 1;
      padding: 0;
    }
    .onComment {
      line-height: 88px;
      .van-button__content {
        display: block;
      }
      font-size: 35px;
      .van-icon {
        position: relative;
        top: 2px;
        line-height: 0;
        font-size: 42px;
      }
    }
    /deep/.van-icon {
      font-size: 45px;
      flex: 1;
      line-height: 88px;
      text-align: center;
      position: relative;
    }
    .van-info {
      font-size: 24px;
      width: 60px;
      height: 30px;
      position: absolute;
      top: 20px;
      left: 25px;
    }
  }
  // 报错区域
  .error-wrap {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .van-icon {
      font-size: 200px;
    }
  }
}
</style>
