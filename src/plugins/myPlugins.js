// 插件对外暴露一定是一个对象
// Vue插件对外暴露一定是一个对象
let myPlugins = {}

myPlugins.install = function(Vue, options) {
    // console.log('自定义插件调用')
    // Vue.prototype.$bus 任何组件都可以使用
    // Vue.directive 
    // Vue.component
    // Vue.filter...
    // 创造一个全局指令  创建一个指令
    Vue.directive(options.name, (element, params)=>{
        element.innerHTML = params.value.toUpperCase()

    })
}

export default myPlugins
