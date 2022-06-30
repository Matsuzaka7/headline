// 文章请求模块
import request from '@/utils/request'

// 获取文章数据
export const getArticle = (params) => {
  return request({
    method: 'GET',
    url: '/v1_0/articles',
    params
  })
}
// 获取文章详情
export const getArticleById = (articleId) => {
  return request({
    method: 'GET',
    url: `/v1_0/articles/${articleId}`
  })
}

// 收藏文章
export const addCollect = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/collections',
    data: { target }
  })
}
// 取消收藏文章
export const delCollect = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/collections/${target}`
  })
}

// 点赞文章
export const addLike = (target) => {
  return request({
    method: 'POST',
    url: '/v1_0/article/likings',
    data: { target }
  })
}
// 取消点赞文章
export const delLike = (target) => {
  return request({
    method: 'DELETE',
    url: `/v1_0/article/likings/${target}`
  })
}
