<template>
  <div>
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="我的关注"
    ></van-nav-bar>
    <van-cell-group class="container" v-if="!isNoData">
      <van-cell v-for="(item, i) in list" :key="i">
        <template #title>
          <van-image class="photo" :src="item.photo" fit="cover" round />
          <span class="name">{{ item.name }}</span>
        </template>
        <template>
          <van-button
            class="follow-btn"
            type="info"
            size="small"
            round
            @click="onFollow(item.id)"
          >
            <slot>
              {{ '取消关注' }}
            </slot>
          </van-button>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 暂无数据 -->
    <NoData v-else />
  </div>
</template>

<script>
import { getUserFollowings, delFollow } from '@/api/user'
import NoData from '@/components/NoData'
export default {
  name: 'userFollowings',
  components: {
    NoData
  },
  data() {
    return {
      list: [],
      // 是否有数据
      isNoData: null
    }
  },
  methods: {
    async loadUserFollowings() {
      if (!this.$store.state.user) {
        this.$toast('您尚未登录!')
        this.$router.push('/login')
        return
      }
      this.$toast.loading({
        message: '加载中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        const { data } = await getUserFollowings()
        const { results } = data.data
        this.list = []
        this.list.push(...results)
        this.$toast('加载完成 !')
        if (this.list.length === 0) {
          this.isNoData = true
        } else {
          this.isNoData = false
        }
      } catch (error) {
        this.$toast('发生未知错误 ! 请重试')
      }
    },
    // 关注与取消关注用户
    async onFollow(id) {
      this.$toast.loading({
        message: '加载中...',
        // 禁止背景点击
        forbidClick: true,
        // 持续展示
        duration: 0
      })
      try {
        // 取消关注用户
        await delFollow(id)
        this.$toast('取消关注成功')
        this.list = []
        this.loadUserFollowings()
      } catch (error) {
        let msg = '发生未知错误 ! 请稍后重试'
        if (error.response && error.response.status === 400) {
          msg = '你不能关注你自己!'
        } else if (error.response && error.response.status === 401) {
          msg = '您尚未登录!'
        }
        this.$toast(msg)
      }
    }
  },
  created() {
    this.loadUserFollowings()
  },
  activated() {
    this.loadUserFollowings()
  }
}
</script>

<style lang="less" scoped>
/deep/.van-nav-bar {
  background-color: #3395fc;
  .van-nav-bar__title {
    color: white;
  }
  .van-icon {
    color: white;
  }
}
/deep/.container {
  padding-top: 100px;
  .photo {
    height: 70px;
    width: 70px;
  }
  .van-cell__title {
    display: flex;
    .name {
      line-height: 75px;
      margin-left: 20px;
    }
  }
  .follow-btn {
    width: 150px;
  }
}
</style>
