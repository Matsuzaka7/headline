<template>
  <div class="user-profile-container">
    <!-- 导航栏 -->
    <van-nav-bar
      class="userProfileNav"
      @click-left="$router.back()"
      title="个人信息"
      left-arrow
    >
    </van-nav-bar>

    <!-- 个人信息 -->
    <van-cell title="头像" @click="$refs.file.click()" is-link>
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      :value="user.name"
      @click="isShowEditName = true"
      is-link
    />
    <van-cell
      title="性别"
      :value="!user.gender ? '男' : '女'"
      is-link
      @click="isShowEditGender = true"
    />
    <van-cell
      title="出生日期"
      :value="user.birthday"
      is-link
      @click="isShowEditBirthday = true"
    />
    <!-- 编辑昵称 -->
    <van-popup
      class="updateName"
      v-model="isShowEditName"
      position="bottom"
      :style="{ height: '100%' }"
      ><UpdateName
        v-if="isShowEditName"
        v-model="user.name"
        @close="isShowEditName = false"
    /></van-popup>
    <!-- 编辑性别 -->
    <van-popup class="updateGender" v-model="isShowEditGender" position="bottom"
      ><UpdateGender
        v-if="isShowEditGender"
        v-model="user.gender"
        @close="isShowEditGender = false"
    /></van-popup>
    <!-- 编辑出生年月 -->
    <van-popup
      class="updateGender"
      v-model="isShowEditBirthday"
      position="bottom"
      ><UpdateBirthday
        v-if="isShowEditBirthday"
        v-model="user.birthday"
        @close="isShowEditBirthday = false"
    /></van-popup>
    <!-- file事件 -->
    <input
      type="file"
      accept="image/*"
      @change="onFileChange"
      hidden
      name=""
      ref="file"
      id=""
    />
    <!-- 编辑头像 -->
    <van-popup
      style="height: 100%"
      class="updateGender"
      v-model="isShowEditPhoto"
      position="bottom"
      ><UpdatePhoto
        v-if="isShowEditPhoto"
        :img="img"
        @updateUserPhoto="user.photo = $event"
        @close="isShowEditPhoto = false"
    /></van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from '@/components/UserProfile/update-name'
import UpdateGender from '@/components/UserProfile/update-gender'
import UpdateBirthday from '@/components/UserProfile/update-birthday'
import UpdatePhoto from '@/components/UserProfile/update-photo'
export default {
  name: 'UserProfileIndex',
  components: {
    UpdateName,
    UpdateGender,
    UpdateBirthday,
    UpdatePhoto
  },
  data() {
    return {
      user: {},
      isShowEditName: false,
      isShowEditGender: false,
      isShowEditBirthday: false,
      isShowEditPhoto: false,
      // 预览头像
      img: null
    }
  },
  created() {
    this.loadUserProfile()
  },
  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('发生未知错误 请稍后重试!')
      }
    },
    onFileChange() {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      // 预览头像弹出层
      this.isShowEditPhoto = true
      // file-input 如果两次选择同一个文件 不会触发change事件
      // 每次使用完 就清空file的value
      // value就是选择的文件的物理路径
      this.$refs.file.value = ''
    }
  }
}
</script>

<style lang="less" scoped>
.user-profile-container {
  /deep/.userProfileNav {
    background-color: #3395fc;
    .van-nav-bar__title,
    .van-icon-arrow-left {
      color: white;
    }
  }
  .avatar {
    width: 60px;
    height: 60px;
  }
  .updateName {
    background-color: #f6f7fa;
  }
}
</style>
