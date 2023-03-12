import Vue from 'vue'
import App from './App.vue'
// 引入路由
import router from './router'

import './assets/icon/iconfont.css'  // 引入相关的字体文件

// 按需引入操作 element-ul
import { Icon, Button, MessageBox } from 'element-ui';


// 三级联动组件 -- 全局组件， 我们要注册全局组件都是在main.js文件中进行注册的
import TypeNav from '@/components/TypeNav'
import Carsousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'

// 引入vuex仓库
import store from '@/store'

// 第一个参数：全局组件的名字 第二个参数：哪一个组件 第一个参数：全局组件的名字
// 使用分页器的时候，自己进行简单的书写即可
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carsousel.name, Carsousel)
Vue.component(Pagination.name, Pagination)

// 应用element-ui组件 注册全局组件
Vue.use(Icon)
Vue.component('el-icon', Icon)
Vue.component('el-button', Button)
// ElementUI注册组件的时候，还有一种写法，挂在原型上面
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;

// 测试 对外暴露的文件就可以通过 import来进行相应的引入操作
// import { reqCategoryList } from '@/api/index'

// 引入MockServer.js -- mock数据 至少要引入使用一次才可以
import '@/mock/mockServe'
// 引入swiper样式，因为多个组件都需要使用到swiper样式
import 'swiper/css/swiper.css'

Vue.config.productionTip = false

// 统一接收api文件夹里面全部请求函数
// 统一引入
import * as API from '@/api'
import atm from '@/assets/1.gif'
// console.log(API)

// 引入懒加载图片的插件
import VueLazyload from 'vue-lazyload'

// 注册插件
Vue.use(VueLazyload, {
  // 懒加载默认的图片
  loading: atm
})

// 引入表单校验插件
import '@/plugins/validate'

new Vue({
  router,
  // 注册仓库 组件实例的身上会多一个属性 $store 属性
  store,
  render: h => h(App),
  // 配置全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API // 挂载到原型组件上，所有接口方法都不用一个个引了
  }
}).$mount('#app')
