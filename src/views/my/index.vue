<template>
  <div class="my-container">
    <router-view class="router-view"></router-view>
    <!-- 已登陆显示 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image class="avatar" :src="userInfo.photo" fit="cover" round />
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <span
            type="default"
            size="mini"
            @click="$router.push('/user/profile')"
            >个人信息 <van-icon name="arrow"
          /></span>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item" @click="$toast('此功能暂未开放 ! ')">
          <span class="count">{{ userInfo.art_count }}</span>
          <span class="text">动态</span>
        </div>
        <div class="data-item" @click="$router.push('/userFollowings')">
          <span class="count">{{ userInfo.follow_count }}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item" @click="$router.push('/userFollowers')">
          <span class="count">{{ userInfo.fans_count }}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item" @click="$toast('此功能暂未开放 ! ')">
          <span class="count">{{ userInfo.like_count }}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录显示 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="@/assets/mobile.png" alt="" />
        <span class="login-text">登录 / 注册</span>
      </div>
    </div>
    <!-- 宫格导航 -->
    <van-grid :column-num="4" :border="false" clickable>
      <van-grid-item
        icon="comment-circle-o"
        text="消息通知"
        @click="$toast('此功能暂未开放 ! ')"
      />
      <van-grid-item
        icon="star-o"
        is-link
        :to="{ name: 'userCollect' }"
        text="我的收藏"
      />
      <van-grid-item
        icon="clock-o"
        is-link
        :to="{ name: 'userHistories' }"
        text="阅读历史"
      />
      <van-grid-item
        icon="orders-o"
        text="我的作品"
        @click="$toast('此功能暂未开放 ! ')"
      />
    </van-grid>

    <!--  -->
    <div class="more">
      <p>更多服务</p>
      <van-grid :column-num="4" :border="false" clickable>
        <van-grid-item
          icon="question-o"
          text="问题反馈"
          @click="$toast('此功能暂未开放 ! ')"
        />
        <van-grid-item
          icon="service-o"
          text="小智同学"
          is-link
          :to="{
            name: 'chat',
            params: { name: this.userInfo.name, photo: this.userInfo.photo }
          }"
        />
        <van-grid-item
          icon="smile-comment-o"
          text="聊天室"
          @click="$toast('此功能暂未开放 ! ')"
        />
      </van-grid>
    </div>

    <van-cell
      title="退出登录"
      v-if="user"
      class="logout-cell"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data() {
    return {
      // 用户信息
      userInfo: {},
      flag: false
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    // 如果用户登录了则请求加载用户信息数据
    if (this.user) {
      this.loadUserinfo()
    }
  },
  activated() {
    // 如果用户登录了则请求加载用户信息数据
    if (this.user) {
      this.loadUserinfo()
    }
  },
  methods: {
    async loadUserinfo() {
      try {
        const { data } = await getUserInfo()
        this.userInfo = data.data
      } catch (error) {
        this.$toast('身份认证过期 请重新登录 !')
        // 清除登录token
        this.$store.commit('setUser', null)
      }
    },
    onLogout() {
      // 退出提示
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '亲,您确定要退出吗?'
        })
        .then(() => {
          // 确认执行
          // 清除登录状态
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 取消执行
        })
    }
  }
}
</script>

<style lang="less" scoped>
.my-container {
  .router-view {
    height: 1000px;
    padding-bottom: -100px !important;
  }
  .header {
    height: 361px;
    background: url('~@/assets/banner.png');
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      justify-self: center;
      flex-direction: column;
      align-items: center;
      .mobile-img {
        height: 132px;
        width: 132px;
        margin-bottom: 15px;
      }
      .login-text {
        color: white;
        font-size: 28px;
      }
    }
  }
  .user-info {
    .base-info {
      height: 225px;
      padding: 60px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      color: white;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          margin-right: 23px;
          border: 4px solid white;
        }
        span {
          font-size: 40px;
        }
      }
      .right {
        // color: white;
        font-size: 30px;
        line-height: 160px;
      }
    }
    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: white;
        .count {
          font-size: 30px;
        }
        .text {
          font-size: 30px;
        }
      }
    }
  }
  .more {
    margin-top: 30px;
    height: 270px;
    background-color: white;
    p {
      padding: 30px 0 10px 45px;
      font-size: 35px;
      margin: 0;
    }
  }
  .logout-cell {
    color: #c7575c;
    margin-top: 30px;
    font-size: 35px;
    text-align: center;
  }
}
</style>
