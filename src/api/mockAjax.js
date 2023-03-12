// 对于axios进行二次封装
import axios from 'axios'
// 引入进度条
import nProgress from 'nprogress'
// 引入进度条的样式
import 'nprogress/nprogress.css'

// start 进度条开始 done 进度条结束
/* 
    1、利用axios对象的方法create，去创建一个axios实例
    2、request就是axios，只不过稍微配置一下

    - 这里的requests就是创建的一个新的实例，其实就是axios，不配置的话，直接书写axios.in... 即可
*/
/* 二次封装 */
const requests = axios.create({
    // 配置对象 
    // 基础路径, 发请求的时候，路径当中会出现api  对外所进行暴露的内容不一样
    baseURL: '/mock',
    // 代表请求超时的时间为 5s
    timeout: 5000,
})

// 请求拦截器，在发请求之前，请求拦截器可以检测到，可以在请求发出去之前做一些事情
requests.interceptors.request.use((config) => {
    // 进度条开始动
    nProgress.start()
    // config ：配置对象，对象里面有一个属性很重要，header请求头
    return config
})

// 响应拦截器
axios.interceptors.response.use((res) => {
    // 成功的回调函数，服务器响应数据回来以后，响应拦截器可以检测到，可以做一些事情
    // 进度条结束
    nProgress.done()
    return res.data
}, (error) => {
    // 相应失败的回调函数
    // 对响应错误做点什么
    return Promise.reject(error);
})

// 对外暴露
export default requests



/* // 添加请求拦截器
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