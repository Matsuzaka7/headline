const { defineConfig } = require('@vue/cli-service')

const isProduction = process.env.VUE_APP_ENV !== 'dev'
// 本地环境是否需要使用cdn
const devNeedCdn = false
const cdn = {
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios',
    vant: 'vant'
  },
  // cdn的css链接
  css: [],
  // cdn的js链接
  js: [
    'https://cdn.bootcss.com/vue/2.6.14/vue.min.js',
    'https://cdn.bootcss.com/vue-router/2.8.1/vue-router.min.js',
    'https://cdn.bootcss.com/axios/0.26.1/axios.min.js',
    'https://cdn.bootcss.com/vant/2.12.47/vant.min.js'
  ]
}

module.exports = {
  chainWebpack: config => {
    // ============注入cdn start============
    config.plugin('html').tap(args => {
    // 生产环境或本地需要cdn时，才注入cdn
      if (isProduction || devNeedCdn) args[0].cdn = cdn
      return args
    })
    // ============注入cdn start============
  },
  configureWebpack: config => {
    // 用cdn方式引入，则构建时要忽略相关资源
    if (isProduction || devNeedCdn) config.externals = cdn.externals
  }
}
module.exports = defineConfig({
  transpileDependencies: true,
  // 告诉webpack打包的index.html引入其他资源文件以./开头 不要以默认/开头
  publicPath: './',
  outputDir: 'dist', // 打包后文件的目录
  assetsDir: 'static', // outputDir的静态资源(js、css、img、fonts)目录
  productionSourceMap: false, // 去除map文件
  lintOnSave: false
})
