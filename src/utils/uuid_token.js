import { v4 as uuidv4} from 'uuid'
// 要生成一个随机的字符串 且每次执行不能发生变化 游客身份持久存储
// export const getUUID = () => {
//     // 先从本地存储获取uuid （看一下本地存储中里面是否有） 使用本地存储的形式来获取uuid等
//     let uuid_token = localStorage.getItem('UUIDTOKEN')
//     // 如果没有
//     if(!uuid_token) {
//         // 生成游客临时身份
//         uuid_token = uuidv4()
//         // 本地存储存储一次
//         localStorage.setItem('UUIDTOKEN', uuid_token)
//     }
//     return uuid_token
// }

export const getUUID = () => {
    // 套路：先看本地存储中有没有，没有的话在进行生成操作，使用本地存储的形式来获取uuid
    let uuid_token = localStorage.getItem('UUIDTOKEN')
    // 如果没有
    if(!uuid_token) {
        // 生成游客临时身份
        uuid_token = uuidv4() 
        // 将生成的内容存储到本地中
        localStorage.setItem('UUIDTOKEN', uuid_token)
    }
    return uuid_token
}