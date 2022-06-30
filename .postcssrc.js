// postcss.config.js
// PostCSS 配置文件
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      // rootValul应该设置为设计稿宽度的十分之一
      // 但Vant建议设计为37.5 因为Vant是基于375写的
      // 数字类型 固定数值
      // rootValue: 75,
      // 函数类型 可以动态处理返回 postcss-pxtorem处理每个css文件都会调用这个函数
      rootValue({ file }) {
        // 结构传过来对象内的file属性
        // 判断路径内是否包含vant 包含则是vant的css 设置为37.5 否则就是我们自己写的css 设置为75
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      },
      // 配置要转换的CSS属性 *代表全部
      propList: ['*'],
      // 配置不要转换的样式资源
      exclude: 'github-markdown'
    }
  }
}
