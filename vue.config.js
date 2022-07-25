const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭js.map文件生成，map映射 可以输出代码错误在第几行，上线后不需要了
  productionSourceMap:false,
  // 关闭eslint校验工具
  lintOnSave:false,
  // 配置代理跨域
  devServer:{
    proxy:{
      '/api':{
        target:'http://gmall-h5-api.atguigu.cn',
        // pathRewrite:{'^/api':''},
      }
    }
  }
})
