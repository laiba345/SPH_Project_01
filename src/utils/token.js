// 因为是进行本次存储操作，所以对外暴露一个函数即可
// 对外暴露一个函数
// 存储TOKEN
export const setToken = (token) => {
    localStorage.setItem('TOKEN', token)
}

// 获取TOKEN
export const getToken = () => {
    // 因为getItem() 我们需要获取相应的内容，所以使用getItem进行即可
    return localStorage.getItem('TOKEN')
}

// 删除token
export const removeToken = () => {
    localStorage.removeItem('TOKEN')
}