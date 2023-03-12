// 就是在vuex中，进行捞数据的操作，需要使用到之前我们定义的那个函数
import { reqGoodsInfo, reqAddOrUpdataShopCart } from "@/api"
// 封装游客身份模块 -> 生成一个随机字符串（不能再变了）
import { getUUID } from '@/utils/uuid_token'
// 书写vuex的时候，直接使用四件套即可
const state = {
    goodInfo: {},
    // 游客临时身份
    uuid_token: getUUID()
}
const mutations = {
    GETGOODINFO(state, goodInfo) {
        state.goodInfo = goodInfo
    }
}
const actions = {
    // 获取产品信息的action 当用户进行dispatch的时候，将那个id传入过来即可
    async getGoodInfo({ commit }, skuId) {
        let result = await reqGoodsInfo(skuId)
        // console.log(result.data)
        if (result.status == 200) {
            commit('GETGOODINFO', result.data)
        }
    },
    // 将产品添加到购物车中
    async addOrUpdateShopCart({ commit }, { skuId, skuNum }) {
        // 加入购物车返回的解构 
        // 加入购物车以后（发请求） 前台将参数带给服务器
        // 服务器写入数据成功，并没有返回其他的数据，只是返回code = 200表示这次操作成功
        // 因为服务器没有返回其余的数据，因此我们不需要三连环存储数据
        let result = await reqAddOrUpdataShopCart(skuId, skuNum)
        // console.log('调用') 测试
        // console.log(result)
        // 注意:async函数执行返回的结果一定是一个promise[要么成功要么失败]
        // 当前这个函数如果执行返回Promise
        // 返回失败
        // return Promise.reject(new Error('fail'))

        // 代表服务器加入购物车成功
        if (result.status == 200) {
            return 'ok'
        } else {
            // 代表加入购物车失败
            return Promise.reject(new Error('faile'))
        }
    }
}

// getters 是为了简化数据而生
const getters = {
    // 路径导航简化的数据
    categoryView(state) {
        /* 
            比如state.goodInfo初始状态为空对象，
            空对象的category属性值为undefined

            - 当前计算出来的categoryView属性值至少是一个空对象，
            - 假的报错就不会有了
        */
        return state.goodInfo?.data?.categoryView || {}
    },
    // 简化产品信息的数据
    skuInfo(state) {
        return state.goodInfo?.data?.skuInfo || {}
    },
    // 产品售卖属性的简化,使用 ?. 来确保内容肯定存在才行 非常关键的情况 
    spuSaleAttrList(state) {
        return state.goodInfo?.data?.spuSaleAttrList || []
    }
}

// 对外进行暴露操作
export default {
    state,
    actions,
    mutations,
    getters
}