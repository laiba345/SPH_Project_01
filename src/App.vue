<template>
  <div>
    <Header /> 
    <!-- App组件作为入口文件之一，可以将那些组件放在这里便于加载 -->
    <!-- 书写路由组件出口的地方，编写路由组件出口的地方 -->
    <!-- <router-view></router-view> 是指定展示的位置，这一点很关键 -->
    <router-view></router-view>
    <!-- 在Home、Search显示的，在登录、注册隐藏 -->
    <!--  -->
    <!-- <Footer v-show="$route.path == '/home' || $route.path == '/search'"/>  -->
    <Footer v-show="$route.meta.show" /> 
  </div>
</template>

<script>
import Header from './components/Header'
import Footer from './components/Footer'
export default {
  name: 'App', 
  components:{ Header, Footer }, 
  mounted() {
    // 通知 Vuex发请求，获取数据，存储于仓库当中
    // 派发一个action || 获取商品分类的三级列表的数据、
    // 所有的组件当中 APP组件只会执行一次，mounted也只会执行一次
    this.$store.dispatch("categoryList");
  },
}
</script>

<style>

</style>
