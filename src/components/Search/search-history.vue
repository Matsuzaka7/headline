<template>
  <div class="search-history">
    <van-cell class="hostory-container" title="搜索历史">
      <span v-if="isShowDel" @click="delAllHistory">全部删除</span>
      <span
        v-if="isShowDel"
        @click=";(isShowDel = false), (isShowClear = false)"
        >完成</span
      >
      <van-icon
        name="delete-o"
        v-else
        @click=";(isShowDel = true), (isShowClear = true)"
      />
    </van-cell>
    <!-- 历史列表 -->
    <div class="history-list">
      <span
        @click="clickSearchHistory(item, i)"
        class="history-item"
        v-for="(item, i) in historyAll"
        :key="i"
        >{{ item }}<van-icon v-if="isShowClear" slot="icon" name="close"
      /></span>
    </div>
  </div>
</template>

<script>
import { getItem, setItem } from '@/utils/storeage'
export default {
  name: 'SearchHistory',
  data() {
    return {
      isShowDel: false,
      historyAll: getItem('his') || setItem('his', []), // 搜索历史
      isShowClear: false
    }
  },
  methods: {
    clickSearchHistory(item, i) {
      if (this.isShowClear) {
        this.historyAll.splice(i, 1)
        if (this.historyAll.length === 0) {
          this.isShowClear = false
          this.isShowDel = false
        }
        setItem('his', this.historyAll)
      } else {
        this.$emit('onSearch', item)
      }
    },
    delAllHistory() {
      this.historyAll = []
      this.isShowDel = false
      this.isShowClear = false
      setItem('his', [])
    }
  }
}
</script>

<style lang="less" scoped>
.search-history {
  .van-cell__value {
    span {
      padding-left: 15px;
    }
  }
  .hostory-container {
    margin-top: -13px;
    background-color: #f8f8f8;
    border: none;
  }
  // 搜索历史
  .history-list {
    padding: 0 30px;
    .history-item {
      line-height: 50px;
      display: inline-block;
      font-size: 25px;
      padding: 8px 20px;
      background-color: #efefef;
      margin: 10px 8px 0 8px;
      border-radius: 10px;
      position: relative;
      .van-icon {
        z-index: 99;
        position: absolute;
        top: -12px;
        font-size: 30px;
      }
    }
  }
}
</style>
