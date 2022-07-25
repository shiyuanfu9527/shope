import Vue from 'vue'
import App from './App.vue'
//三级联动组件---全局组件
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'
import {Button,MessageBox} from 'element-ui'
// ElementUI注册组件的时候，还有一种写法，挂在原型上
Vue.component(Button.name,Button)
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
// 全局组件 第一个参数 组件名，第二个参数 那个组件
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name,Carousel)
Vue.component(Pagination.name,Pagination)
import router from './router'
import store from './store'
Vue.config.productionTip = false
// 引入MockServer.js ----mock数据
import '@/mock/mockServe'
// 引入swiper样式
import "swiper/css/swiper.css"
// 统一接口api文件夹里面全部请求函数
// 统一引入
import * as API from '@/api'
// 引入插件
import VueLazyload from 'vue-lazyload'
import atm from "@/assets/1.gif";
Vue.use(VueLazyload,{
  // 懒加载默认的图片
  loading:atm
})
// 引入自定义插件
import myPlugins from './plugins/myPlugins'
Vue.use(myPlugins,{
  name:'upper'
})
// 引入表单校验插件
import '@/plugins/validate'
new Vue({
  render: h => h(App),
  // 全局事件总线$bus配置
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  },
  router,
  store
}).$mount('#app')
