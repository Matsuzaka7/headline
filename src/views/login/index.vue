<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      @click-left="$router.back()"
      title="登录"
      left-arrow
    />
    <h4 class="loginTitle">头条欢迎您</h4>
    <!-- 登录表单 -->
    <van-form ref="loginForm" @submit="onSubmit" class="form">
      <!--表单验证:
          当表单提交的时候会自动触发表单验证
          验证通过则调用submit事件
       -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.phone"
        maxlength="11"
        type="number"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请填写验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i
        ><template #button>
          <!-- time为倒计时的时长 -->
          <van-count-down
            style="color: #a699b3"
            v-if="isCountDownShow"
            :time="1000 * 60"
            format="ss s"
            @finish="isCountDownShow = false"
          />
          <van-button
            v-else
            native-type="button"
            size="mini"
            class="sendCode"
            round
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="isRememberUser">
        <van-checkbox v-model="isRemember" icon-size="18px"
          >记住手机号</van-checkbox
        >
      </div>
      <div class="btnBox">
        <van-button round block type="info" native-type="submit"
          >登录/注册</van-button
        >
      </div>
    </van-form>
    <span class="code-text">验证码为 246810</span>
  </div>
</template>

<script>
import '@/styles/index.css'
// 加载请求
import { login, sendSms } from '@/api/user'
import { getItem, setItem } from '@/utils/storeage'
// 导入组件
import { Toast } from 'vant'
export default {
  name: 'loginIndex',
  data() {
    return {
      user: {
        mobile: getItem('user-phone') || '13800000000', // 手机号
        code: '' // 验证码
      },
      // 是否记住账号
      isRemember: getItem('user-phone') ? 1 : 0,
      userFormRules: {
        phone: [
          { required: true, message: '请输入手机号' },
          {
            pattern: /1[3|5|7|8|9|4|6]\d{9}$/,
            message: '手机号格式错误!'
          }
        ],
        code: [
          { required: true, message: '请填写验证码' },
          {
            patter: /\d[6]/,
            message: '验证码格式错误'
          }
        ]
      },
      // 控制验证码倒计时是否显示
      isCountDownShow: false
    }
  },
  methods: {
    async onSubmit() {
      Toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间 如果为0 则一直展示 直到下一个Toast出现
      })
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证
      // 3.提交表单 请求登录
      try {
        const { data } = await login(user)
        // 将后端返回的数据 token 放到vuex容器中
        this.$store.commit('setUser', data.data)
        // 登陆成功后 清除LayoutIndex页面的缓存 让它重新渲染 防止用户2显示用户1的
        this.$store.commit('delCachePage', 'LayoutIndex')
        Toast.success({ message: '登录成功!', forbidClick: true })
        if (this.isRemember) {
          setItem('user-phone', this.user.mobile)
        } else {
          setItem('user-phone', null)
        }
        // 登录成功跳转回原来页面
        this.$router.back()
      } catch (err) {
        Toast.fail({ message: '登录失败!请重试', forbidClick: true })
      }
      // 4.根据请求相应结果处理后续操作
    },
    async onSendSms() {
      // 1.校验手机号
      try {
        // 这是一个异步任务
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return err
      }

      // 2.验证通过 显示倒计时
      this.isCountDownShow = true
      // setTimeout(() => {
      //   this.isCountDownShow = false
      // }, 1000 * 60)
      // @finish事件 倒计时结束会自动触发

      // 3.请求发送验证码
      try {
        await sendSms(this.user.mobile)
        Toast.success('发送成功')
      } catch (err) {
        // 发送失败 关闭倒计时
        this.isCountDownShow = false
        Toast.fail('发送失败,请稍后重试')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  width: 100%;
  text-align: center;
  .toutiao {
    font-size: 37px;
    position: relative;
    top: 2px;
  }
  .toutiao:nth-child(2) {
    position: relative;
    top: 3px !important;
  }
  .btnBox {
    padding: 23px 33px;
  }
  .sendCode {
    background-color: #efeef0;
    color: #a699b3;
  }
  .form {
    padding: 20px;
  }
  h4 {
    font-size: 60px;
    text-align: center;
    margin-top: 20%;
    color: #3394fcc7;
    z-index: 2;
  }
  .code-text {
    color: #666;
    font-size: 30px;
  }
  .isRememberUser {
    font-size: 28px;
    margin-left: 34px;
    margin-top: 20px;
  }
}
</style>
