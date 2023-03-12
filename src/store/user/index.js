// 和之前的套路其实是一样的操作 我们一般都是在仓库中发请求
import { reqGetCode, reqUserRegister, reqUserLogin, reqUserInfo, reqLogout } from "@/api"
import { setToken, getToken, removeToken } from "@/utils/token"
// 登录与注册的模块
const state = {
    code: '',
    // token: '',
    // token: localStorage.getItem('TOKEN'), // 其实状态下，就算是没存，相当于null值，但是在下一次刷新的时候就存了
    token: getToken(),
    // token: localStorage.getItem('TOKEN'),
    userInfo: {}
}

const mutations = {
    GETCODE(state, code) {
        state.code = code.data
    },
    USERLOGIN(state, token) {
        state.token = token
    },
    GETUSERINFO(state, userInfo) {
        state.userInfo = userInfo
    },
    CLEAR(state) {
        // 删除用户信息
        state.token = ''
        state.userInfo = {}
        // 还需要清空本地存储的一些内容 token
        removeToken()
    }
}

const actions = {
    // 获取验证码
    async getCode({ commit }, phone) {
        /* 
            获取验证码的这个接口，把验证码返回，但是正常情况下，后台把验证码发到用户手机上[省钱]
            - 如果真是后台处理好了，下面就不用执行commit操作，用户看完会自己进行输入操作
        */
        let result = await reqGetCode(phone)
        // console.log(result)
        if (result.status == 200) {
            commit('GETCODE', result.data)
            return 'OK'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    // 用户注册, 派发action, 然后进行发送请求的操作 
    // 也因为不需要返回数据，所以不需要接着上面书写三连环了
    async userRegister({ commit }, user) {
        let result = await reqUserRegister(user)
        // console.log(result)
        if (result.status == 200) {
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    // 登录业务[token]
    async userLogin({ commit }, data) {
        // 需要的就是等待他成功的结果等 操作，这一点很关键 返回的结果就是登录成功或者是失败等
        let result = await reqUserLogin(data)
        // console.log(result)
        // 服务器下发token，用户唯一标识符（uuid）
        // 将来经常通过带token找服务器要用户信息进行相应展示
        if (result.status == 200) {
            // 用户已经登录成功且获取到了token
            commit('USERLOGIN', result.data.data.token)
            // 持久化存储token，因为token本身就是字符串的形式，所以不用转换
            // localStorage.setItem('TOEKN', result.data.data.token)
            setToken(result.data.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
        }
    },
    // 获取用户登录信息 
    /* async getUserInfo({commit}) {
        let result = await reqUserInfo() // 没有什么参数，发送请求的操作，应该在home组件中完成
        // console.log(result) 
        if(result.status == 200) {
            // 提交用户信息
            commit('GETUSERINFO', result.data)
            // 捞取用户信息，成功也可以，失败也可以
            return 'ok'
        }else {
            return Promise.reject(new Error('fail'))
        }
    } */
    async getUserInfo({ commit }) {
        let result = await reqUserInfo() // 没有什么参数，发送请求的操作，应该在home组件中完成
        // console.log(result)
        if (result.status == 200) {
            // 提交用户信息
            commit('GETUSERINFO', result.data.data)
            // 捞取用户信息，成功也可以，失败也可以
            return 'ok'
        } else {
            return Promise.reject(new Error('faile'))
        }
    },
    // 退出登录
    async userLogout({ commit }) {
        // 只是向服务器发起一次请求，通知服务器清楚token
        let result = await reqLogout()
        // 还需要清楚本地的一些内容
        // 注意 action中不能操作state，我们必须提交到mutation修改state
        if (result.status == 200) {
            commit('CLEAR')
            return 'ok'
        } else {
            return Promise.reject(new Error('fail'))
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