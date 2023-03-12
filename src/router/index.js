import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

import routes from './routes'

// 想要使用store中的state等数据内容，需要先进行引入
import store from '@/store'

// const routes = [
//   {
//     path: '/',
//     name: 'home',
//     component: HomeView
//   },
//   {
//     path: '/about',
//     name: 'about',
//     // route level code-splitting
//     // this generates a separate chunk (about.[hash].js) for this route
//     // which is lazy-loaded when the route is visited.
//     component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
//   }
// ]

// const router = new VueRouter({
//   routes
// })

// export default router


// 先把VueRouter原型对象的push，先保存一份
let originPush = VueRouter.prototype.push
let originReplace = VueRouter.prototype.replace

// 重写push | replace
// 第一个参数，告诉原来的push方法，你往哪里跳转，以及传递哪些参数
// 第二个参数，成功的回调，
// 第三个参数，失败的回调
VueRouter.prototype.push = function (location, resolve, reject) {
  if (resolve && reject) {
    /* 
      call || apply 区别
      相同点：都可以调用函数一次，都可以篡改函数的上下文一次
        都可以更改函数的上下文一次
      不同点：call与apply传递参数，call传递参数用逗号隔开，apply方法执行，传递数组
    */
    originPush.call(this, location, resolve, reject)

  } else {
    originPush.call(this, location, () => { }, () => { })
  }
}

VueRouter.prototype.replace = function (location, resolve, reject) {
  if (resolve && reject) {
    /* 
      call || apply 区别
      相同点：都可以调用函数一次，都可以篡改函数的上下文一次
      不同点：call与apply传递参数，call传递参数用逗号隔开，apply方法执行，传递数组
    */
    originReplace.call(this, location, resolve, reject)
  } else {
    // 有的话，我们就使用resolve | reject，没有的话，我们使用的就是自己书写的回调函数
    originReplace.call(this, location, () => { }, () => { })
  }
}
// 配置路由
// 因为我们要获取这个实例，可以先用一个变量接收，然后将这个变量进行对外暴露
let router = new VueRouter({
  // 配置路由
  routes,
  // 每次跳转以后，页面跳转到最上面即可
  scrollBehavior(to, from, savedPosition) {
    // return 期望滚动到哪个的位置
    /* 返回的y=0表示滚动条在最上方 */
    return { y: 0 }
  }
})

// 全局守卫，前置守卫（在路由跳转之前进行判断）
router.beforeEach(async (to, from, next) => {
  /* 
      // to 可以获取到你要跳转到哪一个路由信息
      // from 可以获取到你从哪个路由来的信息
      // next 是一个放行的函数
          - next() 放行
          - next('/login') next(path) 放行到指定的路由
          - next(false) 
  */
  //   next()
  // console.log(store) 仓库没有你想的那么高大上，可以理解为就是
  // 用户登录了才会有token，未登录一定不会有token
  let token = store.state.user.token
  // 获取用户信息,
  let name = store.state?.user?.userInfo?.name || ''
  // console.log(token)
  // 用户已经登录了
  if (token) {
    // 用户已经登录了还想去login 休想(不能去，停留在首页)
    if (to.path == '/login') {
      next('/home')
    } else {
      // 登录了，去的不是login 【home|search|detail|shopcart】访问的是别的页面
      // 如果用户名已有,有用户名的话，允许跳转到别处
      if (name) {
        next()
      } else {
        // 没有用户信息，派发actions让仓库存储用户信息在跳转
        try {
          // 有成功和失败了，就需要使用try&catch
          await store.dispatch('getUserInfo')
          //  获取用户信息成功，进行放行操作
          next()
        } catch (error) {
          // alert(error.message)
          // token失效了才会走这里，非常关键 获取不到用户信息，重新登录即可
          // 有很多网站，token经过一段时间都会失效
          // 1、清楚token 之前做过，需要派发actions
          // 用户进行识别的时候，有uuid和token两种，以token为大
          await store.dispatch('userLogout') // 退出登录
          next('/login')
        }
      }
    }
  } else {
    // 未登录暂时没有处理完毕，先这个样子，后期在进行处理
    // next()
    // 未登录：不能去交易相关、不能去支付相关的地方【pay|paysuccess】、不能去个人中心
    // 未登录的话，去上面这些路由：跳转到登录页面
    let toPath = to.path
    if (toPath.indexOf('/trade') != -1 || toPath.indexOf('/pay') != -1 || toPath.indexOf('/center') != -1) {
      // 把未登录的时候想去而没去成的信息，存储于地址栏中【路由】
      next('/login?redirect='+toPath)
    } else {
      // 去的不是上面这些路由（home|search|shopcart） --- 放行
      next() 
    }
  }
})

export default router