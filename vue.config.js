const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  // 关闭eslint
  lintOnSave: false,
  devServer: {
    proxy: {
      '/api': {
        // 数据来自于哪一台代理服务器 就使用哪一台代理服务器即可
        target: 'http://gmall-h5-api.atguigu.cn',
      },
    }
  }
})
