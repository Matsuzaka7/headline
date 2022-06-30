<template>
  <div class="search-suggestion">
    <van-cell-group>
      <van-cell
        v-for="(item, i) in searchSuggestions"
        :key="i"
        icon="search"
        @click="$emit('onSearch', item)"
      >
        <!-- 给匹配的字符设置高亮 -->
        <div slot="title" v-html="highlight(item)"></div
      ></van-cell>
    </van-cell-group>
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
import { debounce } from 'lodash'
export default {
  props: ['searchText'],
  name: 'SearchSuggestion',
  data() {
    return {
      // 搜索联想建议
      searchSuggestions: []
    }
  },
  watch: {
    searchText: {
      // 当searchText发生改变 就会调用handler函数
      // lodash库内的方法 用于处理防抖
      // debounce函数 参数1:一个函数 参数2:延迟时间 返回值:防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestions(val)
      }, 300),
      immediate: true
    }
  },
  methods: {
    // 请求搜索联想建议数据
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.searchSuggestions = data.data.options
      } catch (error) {
        this.$toast('发生未知错误 , 请稍后再试!')
      }
    },
    highlight(text) {
      const highlightStr = `<span class='active'>${this.searchText}</span>`
      // 正则表达式 // 中间的内容都会当做匹配字符来使用 而不是数据变量
      // 如果需要根据数据变量动态创建正则 则手动 new RegExp
      // RegExp 是正则表达式构造函数
      // 参数1:匹配模式字符串(会自动解析变量) 根据字符串创建正则表达式
      // 参数2:匹配模式 要写到字符串内
      const reg = new RegExp(this.searchText, 'gi')
      return text.replaceAll(reg, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
.search-suggestion {
  /deep/span.active {
    color: #3296fa !important;
  }
}
</style>
