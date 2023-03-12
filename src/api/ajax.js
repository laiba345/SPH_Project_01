// 对于axios进行二次封装
import axios from 'axios'
// 引入进度条
import nProgress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'

// 在当前模块引入store
import store from '@/store'

// start 进度条开始 done 进度条结束
/* 
    1、利用axios对象的方法create，去创建一个axios实例  
    2、request就是axios，只不过稍微配置一下

    - 这里的requests就是创建的一个新的实例，其实就是axios，不配置的话，直接书写axios.in... 即可
    - 其实此处的requests就是新创建的一个新的实例，其实就是axios，不进行配置的话，可以直接书写axios，建议最好配置一下，
*/
/* 二次封装 */
const requests = axios.create({
    // 配置对象 
    // 基础路径, 发请求的时候，路径当中会出现api  对外所进行暴露的内容不一样 基础路径，baseURL: '/api'
    // 到时候书写接口的时候，发送数据的接口前面有/api的时候，可以进行省略操作
    baseURL: '/api',
    // 代表请求超时的时间为 5s
    timeout: 5000,
})

// 请求拦截器，在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情 请求拦截器在发送请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情，
// 一般要携带一些参数或者其他内容的时候,使用请求拦截器来实现即可
// 请求拦截器使用上面的requests,响应拦截器用axios即可
requests.interceptors.request.use((config) => {
    // console.log(store)
    if(store.state.detail.uuid_token){
        // 给请求头添加一个字段 和后台老师商量好了  userTempId 不能瞎写
        config.headers.userTempId = store.state.detail.uuid_token
    }
    // 需要携带token带给服务器
    if(store.state.user.token) {
        // console.log('@@@')
        config.headers.token = store.state.user.token
    }
    // 进度条开始动
    nProgress.start()
    // 请求拦截器中就算什么都不做的话，也需要返回一个配置对象，要不然会报错，config中包含headers
    // 请求拦截器没有什么内容需要操作的话，可以return config 保证其可以正常运行下去
    return config
})

// 响应拦截器，成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情，响应拦截器自己就使用axios来进行返回数据
/* 同样没有什么数据的时候，返回res.data即可 */
axios.interceptors.response.use((res) => {
    // 进度条结束
    nProgress.done()
    return res.data
}, (error) => {
    // 对响应错误的内容做点什么内容，
    return Promise.reject(error)
})

// 书写完全以后，我们都需要对外进行暴露操作,
// 因为我们对接口的数据操作,都封装在api文件夹中的index.js 文件中，
// 这一点很关键 封装在不同的文件中
export default requests


// requests.interceptors.request.use((config) => {
//     // 进度条开始动
//     // debugger
//     nProgress.start()
//     // config ：配置对象，对象里面有一个属性很重要，header请求头
//     return config
// })

// 响应拦截器
// axios.interceptors.response.use((res) => {
//     // 成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
//     // 进度条结束
//     // debugger
//     nProgress.done()
//     return res.data
// }, (error) => {
//     // 相应失败的回调函数
//     // 对响应错误做点什么
//     return Promise.reject(error);
// })


// 对外暴露
// export default requests



/* // 添加请求拦截器 拦截器interceptors 语法就是如此
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
}, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
}); */