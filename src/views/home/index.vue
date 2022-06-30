<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <div slot="left" class="logo-container" :to="{ name: 'my' }">
        <img src="@/assets/logo.png" class="logo" alt="" />
        <span>头条</span>
      </div>
      <van-button
        @click="$router.push('/search')"
        slot="right"
        class="search-btn"
        type="info"
        size="small"
        round
        icon="search"
        >搜索</van-button
      >
    </van-nav-bar>

    <!-- 频道列表 -->
    <!-- 通过 v-model 绑定当前激活标签对应的索引值,默认情况下启用第一个标签. -->
    <van-tabs class="channel-tabs" v-model="active" swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <article-list :channel="item"
      /></van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" @click="showChannelEdit = true">
        <i class="toutiao toutiao-gengduo more-btn" />
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="showChannelEdit"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <channel-edit
        :channels="channels"
        :active="active"
        @update-active="changeActive"
      />
    </van-popup>
  </div>
</template>

<script>
import '@/styles/index.css'
import { getHomeChannels } from '@/api/user.js'
import { mapState } from 'vuex'
import ArticleList from '@/components/Article/article-list'
import ChannelEdit from '@/components/Channel/channel-edit'
import { getItem } from '@/utils/storeage'
export default {
  name: 'HomeIndex',
  components: {
    ArticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 0,
      // 频道列表
      channels: [],
      // 弹窗显示隐藏状态
      showChannelEdit: false
    }
  },
  created() {
    this.loadChannels()
  },
  methods: {
    async loadChannels() {
      try {
        let channels = []
        if (this.user) {
          // 已登录 请求用户频道
          const { data } = await getHomeChannels()
          channels = data.data.channels
        } else {
          // 未登录 判断是否有本地数据
          const localChannels = getItem('TOUTIAO_Channels')
          if (localChannels) {
            // 本地有数据 直接使用
            channels = localChannels
          } else {
            //  本地没有数据 则请求默认频道数据
            const { data } = await getHomeChannels()
            channels = data.data.channels
          }
        }
        this.channels = channels
      } catch (error) {
        this.$toast(error)
      }
    },
    // showChannelEdit有个默认值为false
    changeActive(i, showChannelEdit = false) {
      this.active = i
      this.showChannelEdit = showChannelEdit
    }
  },
  computed: {
    ...mapState(['user'])
  }
}
</script>

<style lang="less" scoped>
.home-container {
  background-color: #fff;
  padding: 174px 5px 100px;
  /deep/ .van-nav-bar__left {
    overflow: hidden;
  }
  .logo-container {
    display: flex;
    align-items: center;
    height: 100px;
    overflow: hidden;
    .logo {
      width: 60px;
    }
    span {
      font-size: 40px;
      color: #fff;
      font-weight: 200;
      padding-left: 20px;
    }
  }

  /deep/ .van-nav-bar__right,
  .van-nav-bar__left {
    max-width: unset;
  }
  .search-btn {
    color: white;
    width: 300px;
    height: 64px;
    border: none;
    background-color: #5dabff;
    .van-icon {
      color: white;
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      top: 92px;
      left: 0;
      right: 0;
      z-index: 2;
      height: 82px;
    }
    .van-tab {
      min-width: 80px;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 42px !important;
      height: 6px;
      background-color: #3296fa;
    }
    .placeholder {
      flex-shrink: 0;
      width: 66px;
      height: 82px;
      opacity: 0.5;
    }
    .more-btn {
      padding-right: 25px;
      position: fixed;
      right: 0;
      display: flex;
      align-items: center;
      flex: 1;
      background-color: white;
      border: none;
      width: 66px;
      height: 82px;
      opacity: 1;
      font-size: 38px;
      color: black;
      &:before {
        text-align: center;
        flex: 1;
      }
    }
  }
}
</style>
