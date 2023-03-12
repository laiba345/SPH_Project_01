import { reqCategoryList, reqGetBannerList, reqFloorList } from '@/api/index'
// search模块的小仓库
const state = {
    // state中数据默认初始值别瞎写，服务器返回对象，服务器返回数组 【根据接口返回值初始化】
    categoryList: [],
    // 轮播图的数据
    bannerList: [],
    // floorList中最初始的数据是一个简单的数组
    floorList: []
}
const mutations = {
    CATEGORYLIST(state, categoryList) {
        state.categoryList = categoryList
        // 因为我们拿到内容其实是categoryList，它是一个对象，里面有很多的内容，而只有数组data才是我们想要的
        // 内容数据很多,进行相应
        state.categoryList.data.length = 16
    },
    GETBANNERLIST(state, bannerList) {
        state.bannerList = bannerList
    },
    GETFLOORLIST(state, floorList) {
        state.floorList = floorList
    }
}
const actions = {
    // 通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
    async categoryList({ commit }) {
        // 函数获取到的是一个Promise对象，我们要获取到成功的结果
        let result = await reqCategoryList()
        // console.log(result)
        if (result.status == 200) {
            // 如果有数据需要操作的话，肯定是需要使用到commit操作
            // commit才能直接对state里面的数据进行操作
            commit('CATEGORYLIST', result.data)
        }
    },
    // 获取首页轮播图数据
    async getBannerList({ commit }) {
        let result = await reqGetBannerList()
        // console.log(result)
        if (result.status == 200) {
            commit('GETBANNERLIST', result.data)
        }
    },
    // 获取首页Floor数据 书写完相应的actions要在用到的组件处进行相应的派发
    async getFloorList({ commit }) {
        let result = await reqFloorList()
        // console.log(result)
        if (result.status == 200) {
            // 提交mutation
            commit('GETFLOORLIST', result.data)
        }
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters,
}