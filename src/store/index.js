import Vue from 'vue'
import Vuex from 'vuex'

// 需要使用插件一次
Vue.use(Vuex)

// 引入小仓库  (先书写小仓库，然后将小仓库集中到index.js文件中，对外进行集中暴露即可) 
import home from './home'
import search from './search'
import detail from './detail'
import shopcart from './shopcart'
import user from './user'
import trade from './trade'


// 对外暴露Store类的一个实例
export default new Vuex.Store({
    // 实现Vuex仓库模块式开发存储数据
    // 模块化开发 将home模块对外进行暴露操作
    modules: {
        home,
        search,
        detail,
        shopcart,
        user, 
        trade
    }
})