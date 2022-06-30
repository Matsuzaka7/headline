<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">我的频道</div>
      <van-button
        @click="showEditMyChannels = !showEditMyChannels"
        class="edit-btn"
        type="danger"
        size="mini"
        round
        plain
        >{{ !showEditMyChannels ? '编辑' : '完成' }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
        @click="onMyChannelClick(item, i)"
        class="grid-item"
        v-for="(item, i) in myChannels"
        :key="i"
        :text="item.name"
      >
        <van-icon
          slot="icon"
          v-show="showEditMyChannels && myChannels[0].id !== item.id"
          name="clear"
        />
        <!-- 如果i等于父组件传进来的active 那就表示i被选中了 则active样式生效 -->
        <span slot="text" class="text" :class="{ active: i === active }">{{
          item.name
        }}</span></van-grid-item
      >
    </van-grid>

    <!-- 所有频道 -->
    <van-cell :border="false">
      <div slot="title" class="title-text">所有频道</div>
    </van-cell>
    <van-grid direction="horizontal" :gutter="10">
      <van-grid-item
        icon="plus"
        class="grid-item"
        v-for="(item, i) in filterChannels"
        :key="i"
        :text="item.name"
        @click="onAddChannel(item)"
      />
    </van-grid>
  </div>
</template>

<script>
import { getAllChannels, addUserChannel, delUserChannels } from '@/api/channels'
import { mapState } from 'vuex'
import { setItem, getItem } from '@/utils/storeage'
export default {
  props: {
    channels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  name: 'ChannelEdit',
  data() {
    return {
      // 我的频道
      myChannels: this.channels,
      // 频道推荐
      Allchannels: [],
      // 频道编辑状态
      showEditMyChannels: false
    }
  },
  methods: {
    // 获取所有频道
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels()
        this.Allchannels = data.data.channels
      } catch (error) {
        this.$toast('获取失败 , 请重试 !')
      }
    },
    // 判断是否登录 登录则获取用户频道 否则获取本地频道
    async loadMyChannels() {
      if (this.user) {
        this.myChannels = this.channels
      } else {
        const data = await getItem('TOUTIAO_Channels')
        this.myChannels = data
      }
    },
    // 将点击频道添加到我的频道
    async onAddChannel(item) {
      this.myChannels.push(item)
      // 数据持久化处理
      if (this.user) {
        // 已登录 存储到线上
        try {
          // 将频道推送给服务器
          addUserChannel({
            id: item.id,
            seq: this.myChannels.length // 序号
          })
        } catch (error) {
          this.$toast('操作失败 , 请重试 !')
        }
      } else {
        // 未登录 存储到本地
        setItem('TOUTIAO_Channels', this.myChannels)
      }
    },
    async onMyChannelClick(item, i) {
      // 如果编辑状态为true 那就删除点击频道 否则切换到点击频道
      if (this.showEditMyChannels) {
        // 如果是固定频道 '推荐' 那就不删除
        if (this.myChannels[0].id === item.id) {
          return
        }
        // 删除频道项
        // 参1:要删除的元素开始索引 参2:删除的个数
        this.myChannels.splice(i, 1)
        // 如果删除的是当前频道之前的频道 则让当前频道的索引-1 否则会错位
        if (i <= this.active) {
          // 让当前频道的索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        // 处理数据持久化
        this.deleteChannel(item)
      } else {
        this.$emit('update-active', i)
      }
    },
    async deleteChannel(item) {
      if (this.user) {
        // 已登录 将数据更新到线上
        try {
          delUserChannels(item.id)
        } catch (error) {
          this.$toast('操作失败 , 请重试 !')
        }
      } else {
        // 未登录 存储到本地
        setItem('TOUTIAO_Channels', this.myChannels)
      }
    }
  },
  created() {
    this.loadAllChannels()
    // this.loadMyChannels()
  },
  computed: {
    ...mapState(['user']),
    // filterChannels() {
    //   // 推荐频道
    //   const channels = []
    //   this.Allchannels.forEach((channel) => {
    //     // find也是遍历数组 找到满足条件的元素项
    //     const ret = this.channels.find((myChannel) => {
    //       return myChannel.id === channel.id
    //     })
    //     // ret为true则证明我的频道中包含该频道 则不执行操作
    //     // 反之则证明我的频道中不包含该频道 那就添加到推荐频道中
    //     if (!ret) {
    //       channels.push(channel)
    //     }
    //   })
    //   // 返回推荐频道
    //   return channels
    // }
    // 依赖数据产生变化 则会重新计算
    filterChannels() {
      // 过滤
      return this.Allchannels.filter((channel) => {
        // 为true则证明我的频道包含该频道 取反为false
        // 反之证明我的频道中不包含该频道 取反为true
        // 为true则会将当前这个数据添加到filter生成的数组内 也就是推荐频道
        return !this.channels.find((myChannel) => myChannel.id === channel.id)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  .van-button {
    width: 100px;
  }
  .van-grid {
    .van-grid-item__content {
      background-color: #666;
    }
  }
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/.grid-item {
    width: 16px;
    height: 86px;
    .active {
      color: #f85959 !important;
    }
    .van-grid-item__content {
      background-color: #f4f5f6;
      white-space: nowrap;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-left: 3px;
        margin-top: 0;
      }
      .van-icon {
        font-size: 25px;
      }
      .van-icon-clear {
        z-index: 99;
        font-size: 30px;
        position: absolute;
        right: -95px;
        top: -35px;
      }
    }
  }
}
</style>
