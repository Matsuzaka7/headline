<template>
  <div class="container">
    <!-- 固定导航 -->
    <van-nav-bar
      fixed
      left-arrow
      @click-left="$router.back()"
      title="小智同学"
    ></van-nav-bar>

    <!-- 聊天主体区域 -->
    <div class="chat-list">
      <div v-for="(obj, index) in list" :key="index">
        <!-- 左侧是机器人小思 -->
        <div class="chat-item left" v-if="obj.name === 'xs'">
          <van-image
            fit="cover"
            round
            src="https://img.yzcdn.cn/vant/cat.jpeg"
          />
          <div class="chat-pao">{{ obj.msg }}</div>
        </div>

        <!-- 右侧是当前用户 -->
        <div class="chat-item right" v-if="obj.name === 'me'">
          <div class="chat-pao">{{ obj.msg }}</div>
          <van-image fit="cover" round :src="photo" />
        </div>
      </div>
    </div>

    <!-- 对话区域 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model="word" @keyup.enter="sendFn" placeholder="说点什么...">
        <template #button>
          <span class="button-size" @click="sendFn">提交</span>
        </template>
      </van-field>
    </div>
  </div>
</template>

<script>
// 导入 socket.io-client 包
import { io } from 'socket.io-client'

export default {
  name: 'ChatIndex',
  props: ['name', 'photo'],
  data() {
    return {
      word: '', // 输入框的内容
      // 所有的聊天消息
      list: [
        // 只根据 name 属性,即可判断出这个消息应该渲染到左侧还是右侧
        { name: 'xs', msg: 'hi,你好 ! 我是小智' },
        { name: 'me', msg: `我是${this.name}` }
      ],
      socket: null
    }
  },
  created() {
    // 检测用户是否登录
    if (!this.$store.state.user) {
      this.$toast('您尚未登录!')
      this.$router.push('/login')
      return
    }
    // 创建客户端 websocket 的实例
    this.socket = io('http://toutiao.itheima.net', {
      query: {
        tokeb: this.$store.state.user.token
      },
      transports: ['websocket']
    })
    // conner内置事件 链接成功就会调用此事件
    // this.socket.on('connect', () => {
    //   console.log('链接建立成功')
    // })
    // 接收后端传回来的消息
    this.socket.on('message', (obj) => {
      // 将消息push到数组内 -> v-for更新视图
      this.list.push({
        name: 'xs',
        msg: obj.msg
      })
      // 等数据更新完再获取最后一条消息的位置
      this.$nextTick(() => {
        const theDiv = document.querySelector('.chat-list>div:last-child')
        // scrollIntoView()方法 将调用它的元素滚动到浏览器窗口的可见区域
        theDiv.scrollIntoView({
          behavior: 'smooth'
        })
      })
    })
  },
  methods: {
    // 发送消息
    sendFn() {
      // 没有输入内容则返回
      if (this.word.trim().length === 0) return
      // 用socket向后端发送消息
      this.socket.emit('message', {
        // 输入的内容
        msg: this.word,
        // 当前时间戳
        timestamp: new Date().getTime()
      })
      // 将我发送的消息更新到list中
      this.list.push({
        name: 'me',
        msg: this.word
      })
      this.word = ''
    }
  },
  // 组件被销毁时,清空 socket 对象
  beforeDestroy() {
    // 销毁socket链接
    this.socket.close()
    this.socket = null
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-sizing: border-box;
  background: #fafafa;
  padding: 100px 15px;
  /deep/.van-nav-bar {
    background-color: #3395fc;
    .van-nav-bar__title {
      color: white;
    }
    .van-icon {
      color: white;
    }
  }
  .chat-list {
    height: 100%;
    overflow-y: scroll;
    .chat-item {
      padding: 10px;
      height: 10%;
      .van-image {
        vertical-align: top;
        width: 80px;
        height: 80px;
      }
      .chat-pao {
        vertical-align: top;
        display: inline-block;
        min-width: 40px;
        max-width: 70%;
        min-height: 40px;
        line-height: 55px;
        border: 0.5px solid #c2d9ea;
        border-radius: 4px;
        position: relative;
        top: 10px;
        padding: 0 15px;
        background-color: #e0effb;
        word-break: break-all;
        font-size: 30px;
        color: #333;
        &::before {
          content: '';
          width: 10px;
          height: 10px;
          position: absolute;
          top: 12px;
          border-top: 0.5px solid #c2d9ea;
          border-right: 0.5px solid #c2d9ea;
          background: #e0effb;
        }
      }
    }
  }
}
.chat-item.right {
  text-align: right;
  .chat-pao {
    margin-left: 0;
    margin-right: 15px;
    &::before {
      right: -6px;
      transform: rotate(45deg);
    }
  }
}
.chat-item.left {
  text-align: left;
  .chat-pao {
    margin-left: 15px;
    margin-right: 0;
    &::before {
      left: -5px;
      transform: rotate(-135deg);
    }
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 100px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .button-size {
    display: inline-block;
    margin-top: 5px;
    font-size: 28px;
    color: #999;
  }
}
</style>
