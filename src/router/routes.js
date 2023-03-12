// 引入路由组件
// import Home from '@/pages/Home'
// import Search from '@/pages/Search'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Detail from '@/pages/Detail'
import AddCartSuccess from '@/pages/AddCartSuccess'
import ShopCart from '@/pages/ShopCart'
import Trade from '@/pages/Trade'
import Pay from '@/pages/Pay'
import PaySuccess from '@/pages/PaySuccess'
import Center from '@/pages/Center'

// 引入二级组件路由
import MyOrder from '@/pages/Center/myOrder'
import GroupOrder from '@/pages/Center/groupOrder'

/* 
    当打包构建应用时，JavaScript包会变得非常大，影响页面加载
    如果我们能把不同路由对应的组件分成不同的代码块，
    然后当路由被访问的时候才加载对应组件，这样就更加高效了。
*/
// const foo = () => import('@/pages/Home')
// 路由的配置信息
export default [
    // 书写一个重定向，让项目在跑起来的时候，访问 / , 立马让他定向到首页
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/', // 我们书写使用的是params参数进行传递，所以需要占位
        component: () => import('@/pages/Home'),
        meta: { show: true }
    },
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/center', // 我们书写使用的是params参数进行传递，所以需要占位
        component: Center,
        meta: { show: true },
        // center 里面有子组件，使用二级路由操作即可
        // 二级路由 children
        children: [
            {
                path: 'myorder',
                component: MyOrder
            },
            {
                path: 'grouporder',
                component: GroupOrder
            },
            {
                // 使用重定向的书写操作，只要在center中，就重定向显示
                // 只要一访问center就跳转到这里
                path: '/center',
                redirect: '/center/myorder'
            }
        ]
    },
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/paysuccess', // 我们书写使用的是params参数进行传递，所以需要占位
        component: PaySuccess,
        meta: { show: true }
    },
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/pay', // 我们书写使用的是params参数进行传递，所以需要占位
        component: Pay,
        meta: { show: true },
        beforeEnter: (to, from, next) => {
            if (from.path == '/trade') {
                next()
            } else {
                next(false)
            }
        }
    },
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/trade', // 我们书写使用的是params参数进行传递，所以需要占位
        component: Trade,
        meta: { show: true },
        // 路由独享守卫 - 书写在具体的某一个路由当中，书写在具体要进入的某一个路由当中
        beforeEnter: (to, from, next) => {
            // 去交易页面，必须从购物车来
            if (from.path == '/shopcart') {
                next()
            } else {
                // 其他的路由组件来，停留在当前即可
                next(false)
            }
        }
    },
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/shopcart', // 我们书写使用的是params参数进行传递，所以需要占位
        component: ShopCart,
        meta: { show: true }
    },
    {
        // 路由我们都是写得小写， 进行操作才行
        path: '/addcartsuccess', // 我们书写使用的是params参数进行传递，所以需要占位
        name: 'addcartsuccess',
        component: AddCartSuccess,
        meta: { show: true }
    },
    {
        path: '/detail/:skuid', // 我们书写使用的是params参数进行传递，所以需要占位
        component: Detail,
        meta: { show: true }
    },
    {
        path: '/home',
        component: () => import('@/pages/Home'),
        meta: { show: true }
    },
    {
        name: 'search',
        path: '/search/:keyWord?',
        component: () => import('@/pages/Search'),
        meta: { show: true },
        // 路由组件能不能传递props数据？ 
        // 1、布尔值写法 只能传递params参数
        // props: true,
        // 2、对象写法,额外给路由组件传递一些props
        // props: { a: 1, b: 2 }
        // 3、函数写法：可以把params参数，query参数，通过props传递给路由组件
        props: ($route) => {
            return { keyWord: $route.params.keyWord, k: $route.query.k }
        }
    },
    {
        path: '/login',
        component: Login,
        meta: { show: false }
    },
    {
        path: '/register',
        component: Register,
        meta: { show: false }
    }
]