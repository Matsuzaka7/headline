<template>
  <div class="search-container">
    <!-- 搜索栏 -->
    <van-nav-bar
      class="searchNav"
      @click-left="$router.back()"
      @click-right="onSearch(searchText)"
      right-text="搜索"
      left-arrow
    >
      <van-search
        background="#3395fc"
        slot="title"
        v-model="searchText"
        placeholder="请输入搜索关键词"
        shape="round"
        @focus="isShowSearchRes = false"
        @search="onSearch"
      ></van-search>
    </van-nav-bar>
    <!-- 搜索结果 -->
    <!-- 如果 isShowSearchRes 为true 就显示结果 -->
    <search-result
      :search-text="searchText"
      v-if="isShowSearchRes"
    ></search-result>
    <!-- 联想建议 -->
    <!-- v-if判定为false 然后判断searchText是否为空 不为空显示搜索建议 -->
    <search-suggestion
      @onSearch="onSearch"
      :searchText="searchText"
      v-else-if="searchText"
    ></search-suggestion>
    <!-- 搜索历史记录 -->
    <!-- 否则显示搜索历史 -->
    <search-history
      ref="searchHistory"
      @onSearch="onSearch"
      v-else
    ></search-history>
  </div>
</template>

<script>
import SearchHistory from '@/components/Search/search-history'
import SearchSuggestion from '@/components/Search/search-suggestion'
import SearchResult from '@/components/Search/search-result'
import { getItem, setItem } from '@/utils/storeage'
export default {
  name: 'SearchIndex',
  components: {
    SearchHistory,
    SearchSuggestion,
    SearchResult
  },
  data() {
    return {
      searchText: '',
      isShowSearchRes: false
    }
  },
  methods: {
    onSearch(text = this.searchText) {
      this.searchText = text
      this.isShowSearchRes = true
      const newHistory = getItem('his')
      // 判断是否有重复的搜索历史
      const isRepetition = newHistory.some((item) => {
        if (item === text) {
          // 有则返回true
          return true
        }
        // 没有则遍历完数组返回false
        return false
      })
      // 如果为true就打断下面代码执行
      if (isRepetition) {
        return
      }
      newHistory.unshift(text)
      // 添加搜索记录到本地存储
      setItem('his', newHistory)
    }
  }
}
</script>

<style lang="less" scoped>
.search-container {
  padding-top: 108px;
  /deep/.searchNav {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1;
    background-color: #3395fc;
    overflow: hidden;
    .van-nav-bar__left {
      padding-left: 35px;
      padding-right: 35px;
    }
    .van-nav-bar__text,
    .van-icon-arrow-left {
      color: white;
    }
    .van-nav-bar__title {
      max-width: unset;
    }
  }
  /deep/.van-search {
    width: 560px;
    height: 80px !important;
    margin-left: -15px;
  }
}
</style>
