<template>
  <div class="article-item">
    <van-cell
      class=""
      is-link
      :to="{ name: 'article', params: { articleId: article.art_id } }"
    >
      <div slot="title" class="van-multi-ellipsis--l2">
        {{ article.title }}

        <div slot="label">
          <div v-if="article.cover.type === 3" class="cover-wrap">
            <div
              class="cover-item"
              v-for="(item, i) in article.cover.images"
              :key="i"
            >
              <van-image
                fit="cover"
                lazy-load
                class="cover-image"
                :src="item"
              />
            </div>
          </div>
          <div class="label-info-wrap">
            <div>
              <span>{{ article.aut_name }}</span
              ><span>{{ article.comm_count }} 评论</span
              ><span>{{ article.pubdate | relativeTime }}</span>
            </div>
          </div>
        </div>
      </div>
      <van-image
        v-if="article.cover.type === 1"
        slot="default"
        class="right-cover"
        fit="cover"
        lazy-load
        :src="article.cover.images[0]"
      />
    </van-cell>
  </div>
</template>

<script>
// 导入图片懒加载
import Vue from 'vue'
import { Lazyload } from 'vant'
Vue.use(Lazyload)
export default {
  name: 'ArticleItem',
  props: {
    article: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.article-item {
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  .right-cover {
    width: 232px;
    height: 146px;
  }
  .van-cell__title {
    display: flex;
    flex-direction: column;
  }
  .van-multi-ellipsis--l2 {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
  .label-info-wrap {
    flex: 1;
    position: relative;
    bottom: 0;
    span {
      font-size: 22px;
      color: #b4b4b4;
      margin-right: 15px;
    }
  }
  .cover-wrap {
    padding: 30px 0;
    display: flex;
    .cover-item {
      height: 146px;
      // 不包括最后一个元素
      &:not(:last-child) {
        padding-right: 4px;
      }
      flex: 1;
      .cover-image {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>
