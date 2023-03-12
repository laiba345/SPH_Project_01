import { reqGetSearchInfo } from "@/api"
/* 
    书写了vuex组件， 里面的数据的样式，我们在google中需要在vue中的vuex中进行搜寻
*/
// search模块的小仓库
const state = {
    // 仓库初始状态
    searchList: {}, 
    // goodsList: [], 
}
const mutations = {
    GETSEARCHLIST(state, searchList) {
        state.searchList = searchList
        // console.log(state.searchList.data.goodsList)
    }, 
    /* GOODSLIST(state, goodsList) {
        state.searchList.data.goodsList = goodsList
    } */
}
const actions = {
    // 获取search模块数据 actions当中第一个参数本来是context，而context中含有commit，所以之前一直都是用的解构赋值操作
    async getSearchList({ commit }, params = {}) {
        // 当前reqGetSearchInfo这个函数在调用获取服务器数据的时候，至少传递一个参数(空对象)
        // params形参：是当用户派发action的时候，第二个参数传递过来，至少是一个空对象
        let result = await reqGetSearchInfo(params)
        // console.log(result)
        if (result.status == 200) {
            commit('GETSEARCHLIST', result.data)
            // commit('GOODSLIST', result.data)
        }
    }
}

// getters 计算属性，在项目当中，为了简化仓库数据而生的 （简化数据而生）不同模块下的内容不同
// 可以把我们将来在组件中需要用的数据简化一下，【将来组件在获取数据的时候就方便了】
// 为简化数据而生
const getters = {
    // 当前形参state是当前仓库中的state，并非大仓库中的那个state
    goodsList(state) {
        // state.searchList.goodsList 如果服务器数据回来了，没问题就是一个数组
        // 假如网络不给力，返回的是undefined 使用 ?. 就是有这个好处
        return state.searchList?.data?.goodsList || []
    },
    trademarkList(state) {
        return state.searchList?.data?.trademarkList || []
    },
    attrsList(state) {
        return state.searchList?.data?.attrsList || []
    }, 
    total(state) {
        return state.searchList?.data?.total 
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
}