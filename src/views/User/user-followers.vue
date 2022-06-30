<template>
  <div>
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="我的粉丝"
    ></van-nav-bar>
    <van-cell-group class="container" v-if="!isNoData">
      <van-cell v-for="(item, i) in list" :key="i">
        <template #title>
          <van-image class="photo" :src="item.photo" fit="cover" round />
          <span class="name">{{ item.name }}</span>
        </template>
        <template>
          <FollowUser
            class="follow-btn"
            v-model="item.mutual_follow"
            :userId="item.id"
          ></FollowUser>
        </template>
      </van-cell>
    </van-cell-group>
    <!-- 暂无数据 -->
    <NoData v-else />
  </div>
</template>

<script>
import { getUserFollowers } from '@/api/user'
import FollowUser from '@/components/FollowUser'
import NoData from '@/components/NoData'
export default {
  name: 'userFollowers',
  components: {
    FollowUser,
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
    async loadUserFollowers() {
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
        const { data } = await getUserFollowers()
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
    }
  },
  created() {
    this.loadUserFollowers()
  },
  activated() {
    this.loadUserFollowers()
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
