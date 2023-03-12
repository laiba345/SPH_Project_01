// 写三连环之前先要把之前书写好的接口函数，引入，方便后续的调用
import { reqCartList, reqDeleteCartById, reqUpdateCheckedById } from "@/api"
const state = {
    cartList: []
}
const mutations = {
    GETCARTLIST(state, cartList) {
        state.cartList = cartList
    }
}
const actions = {
    // 获取购物车列表数据 获取购物车数据这一点很关键，进行相应的解构赋值操
    async getCartList({ commit }) {
        let result = await reqCartList()
        // console.log(result)
        if (result.status == 200) {
            // 捞到数据，进行三连环展示操作
            commit('GETCARTLIST', result.data)
        }
    },
    // 删除购物车某一个产品
    async deleteCartListBySkuId({ commit }, skuId) {
        // 求别人办事，需要对仓库中的数据进行操作，返回不了数据，所以不用书写三连环
        let result = await reqDeleteCartById(skuId)
        console.log(result)
        // 返回不了数据，但是可以返回一个状态码用来指定相应的内容
        if (result.status == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    // 修改购物车某一个产品的选中状态 不需要对仓库的数据进行修改的时候，直接就是对里面的数据进行修改和西裤是
    // 只是告诉服务器，我把某一个产品修改了，然后服务器返回说，好了修改完毕了
    async updateCheckedById({ commit }, { skuId, isChecked }) {
        let result = await reqUpdateCheckedById(skuId, isChecked)
        if (result.status == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    deleteAllCheckedCart({ dispatch, getters }) {
        // alert('删删删')  上面可以使用dispatch自己捞数据即可 进行dispatch的时候，就可以进行相应的派发操作
        /* 
            context：小仓库
            commit【提交mutations修改state】
            getters【计算属性】
            dispatch【派发action】可以派发本地的action进行一系列的调用操作才行，这一点很关键
            state【当前仓库数据】
        */
        // 其中有对象的话，第0个对象，需要使用[0] 包裹起来才可以
        // console.log(getters.cartList[0].cartInfoList)
        // 获取购物车中全部的产品，是一个数组
        let PromiseAll = []
        getters.cartList[0].cartInfoList.forEach((item) => {
            // console.log(123) 想触发action一定是需要通过派发action来执行的
            let promise = item.isChecked == 1 ? dispatch('deleteCartListBySkuId', item.skuId) : ''
            /* 
                Promise.all([p1, p2, p3])
                p1 | p2 | p3 每一个都是Promise对象，
                    - 如果有一个Promise失败，那么都失败
                    - 如果都成功，返回成功
            */
            PromiseAll.push(promise)
        })
        // 只要全部的p1|p2... 都成功，返回的结果即为成功
        // 如果有一个失败,返回即为失败结果
        return Promise.all(PromiseAll)

    },
    // 修改全部产品的状态
    updateAllCartChecked({ dispatch, state }, isChecked) {
        // console.log(state)
        // console.log(isChecked)
        // 数组
        let promiseAll = []
        state.cartList.data[0].cartInfoList.forEach((item) => {
            let promise = dispatch('updateCheckedById', { skuId: item.skuId, isChecked })
            promiseAll.push(promise)
        })
        // 最终返回的结果
        return Promise.all(promiseAll)
    }
}

const getters = {
    cartList(state) {
        return state.cartList.data || {}
    },
    // 计算出来购物车的数据
    /* cartInfoList(state) {

    } */
}

export default {
    state,
    mutations,
    actions,
    getters
}