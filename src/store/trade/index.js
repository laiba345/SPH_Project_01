// 需要书写文件的时候，需要先引入获取数据的接口
import { reqAddressInfo, reqOrderInfo } from "@/api"
const state = {
    address: [], 
    orderInfo: {}
}

const mutations = {
    GETUSERADDRESS(state, address) {
        state.address = address
    }, 
    GETORDERINFO(state, orderInfo) {
        state.orderInfo = orderInfo
    }
}

const actions = {
    // 获取用户地址信息
    async getUserAddress({ commit }) {
        let result = await reqAddressInfo()
        // console.log(result)
        if (result.status == 200) {
            commit('GETUSERADDRESS', result.data.data)
        }
    },
    // 获取商品清单的信息
    async getOrderInfo({ commit }) {
        let result = await reqOrderInfo()
        if (result.status == 200) {
            commit('GETORDERINFO', result.data.data)
        }
    }
}
const getters = {}

export default {
    state,
    mutations,
    actions,
    getters
}