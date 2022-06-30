// 用户相关请求模块
import request from '@/utils/request'
import store from '@/store'
// 登录接口
export const login = (data) => {
  return request({
    method: 'POST',
    url: '/v1_0/authorizations',
    // 传递进来的数据
    data
  })
}
// 发送短信接口
export const sendSms = (mobile) => {
  return request({
    method: 'GET',
    url: `/v1_0/sms/codes/${mobile}`
  })
}
// 用户个人信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user'
  })
}

// 获取用户频道列表接口
export const getHomeChannels = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = (userId) => {
  return request({
    method: 'POST',
    url: '/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}

// 取消关注用户
export const delFollow = (userId) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/user/followings/${userId}`
  })
}

// 用户个人信息
export const getUserProfile = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/profile'
  })
}

// 编辑用户个人信息
export const updateUserProfile = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/profile',
    data
  })
}

// 编辑用户照片资料(头像、身份证照片)
export const updateUserImg = (data) => {
  return request({
    method: 'PATCH',
    url: '/v1_0/user/photo',
    data
  })
}

// 用户收藏列表
export const getUserCollect = () => {
  return request({
    method: 'GET',
    url: '/v1_0/article/collections'
  })
}

// 用户阅读历史
export const getUserHistories = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/histories',
    params: {
      page: 1,
      per_page: 200
    }
  })
}

// 用户粉丝量
export const getUserFollowers = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/followers',
    params: {
      page: 1,
      per_page: 200
    }
  })
}

// 用户关注量
export const getUserFollowings = () => {
  return request({
    method: 'GET',
    url: '/v1_0/user/followings',
    params: {
      page: 1,
      per_page: 200
    }
  })
}

// 获取新的tokne
export const getNewToken = () => {
  return request({
    method: 'PUT',
    url: ' /v1_0/authorizations',
    headers: {
      Authorization: 'Bearer ' + store.state.user.refresh_token
    }
  })
}
