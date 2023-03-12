// 当前这个模块： API进行统一管理
// 有多少个数据管理 就是用index.js文件来进行相应的管理应用操作
import requests from './ajax'
import mockRequest from './mockAjax'

// 三级联动接口
// /api/product/getBaseCategoryList  get请求 无参数
// 发请求 axios 发请求返回结果Promise对象
/* export default reqCategoryList = () => {
    return requests({url:'/product/getBaseCategoryList', method:'get'})
} */

// 简写形式  调用一开始对外暴露的requests 
// 里面传入相应的url和method
export const reqCategoryList = () => requests({ url: '/product/getBaseCategoryList', method: 'get' })

// 获取banner （Home首页轮播图接口）
export const reqGetBannerList = () => mockRequest.get('/banner')

// 获取floor数据
/* 
    在mockAjax中重写了axios，对axios进行了二次封装操作，
    并对外暴露了requests
    本文件用mockRequest表示，在进行获取数据的时候就使用
*/
export const reqFloorList = () => mockRequest.get('/floor')

// 获取搜索模块数据 地址：/api/list 请求方式：post
// 参数：需要带参数，前面的请求我们都不需要带上相应的参数
/* 
{
  "category3Id": "61",
  "categoryName": "手机",
  "keyword": "小米",
  "order": "1:desc",
  "pageNo": 1,
  "pageSize": 10,
  "props": ["1:1700-2799:价格", "2:6.65-6.74英寸:屏幕尺寸"],
  "trademark": "4:小米"
}
*/
/* 
    axios传递参数的两种写法，两种都会用到
    - 1、axios.get('url')
    - 2、axios({})
*/
// 当前这个函数需不需要接受外部传递参数 params表示向服务器传递参数 request向真实服务器发送请求
// 当前这个接口，（获取搜索模块的数据）给服务器传递参数params，至少是一个空对象，、
export const reqGetSearchInfo = (params) => requests({
    url: '/list',
    method: 'post',
    data: params,
})

// 获取产品详情信息的接口 URL：/api/item/{ skuId }  请求方式 get
export const reqGoodsInfo = (skuId) => requests({
    // 里面要获取相应的内容，所以需要使用模板字符串来进行书写
    url: `/item/${skuId}`,
    method: 'get'
})

// 将产品添加到购物车中（获取更新一个产品的个数） /api/cart/addToCart/{ skuId }/{ skuNum } POST
export const reqAddOrUpdataShopCart = (skuId, skuNum) => requests({
    url: `/cart/addToCart/${skuId}/${skuNum}`,
    method: 'post',
})

// 获取购物车列表数据接口 URL： /api/cart/cartList method:get
export const reqCartList = () => requests({
    url: '/cart/cartList',
    method: 'get'
})

// 在index.js文件中对数据库进行相应的操作，这一点很关键
// 删除购物车产品的接口 /api/cart/deleteCart/{skuId}
// 写完接口以后，写仓库三连环
export const reqDeleteCartById = (skuId) => requests({
    url: `/cart/deleteCart/${skuId}`,
    method: 'delete'
})

// 需要对数据进行改变操作的话，就需要对接口进行相应操作
// 修改商品的选中状态 /api/cart/checkCart/{skuId}/{isChecked} method:get
export const reqUpdateCheckedById = (skuId, isChecked) => requests({
    url: `/cart/checkCart/${skuId}/${isChecked}`,
    method: 'get'
})

// 获取商品验证码 /api/user/passport/sendCode/{phone} method: 'get'
export const reqGetCode = (phone) => requests({
    url: `/user/passport/sendCode/${phone}`,
    method: 'get',
})

// 注册的接口 
// url:/api/user/passport/register method:post  phone code password(带的东西太多了，可以放到一个对象当中)
export const reqUserRegister = (data) => requests({
    url: '/user/passport/register',
    data,
    method: 'post'
})

// 操作也是一样的，书写登录接口
// url：'/api/user/passport/login' method:post  phone password 
// 书写接口完了以后,去仓库中发送请求, 这一点很关键 
export const reqUserLogin = (data) => requests({
    url: '/user/passport/login',
    data,
    method: 'post'
})

// 需要对接口操作的话，都是需要书写相应的方法的
// 获取用户信息【需要带着用户的token向服务器要用户信息】 
// 没有参数的话还是使用请求头来进行携带操作
// URL:api/user/passport/auth/getUserInfo  method: get
export const reqUserInfo = () => requests({
    url: 'user/passport/auth/getUserInfo',
    method: 'get'
})

// 退出登录 /api/user/passport/logout
export const reqLogout = () => requests({
    url: '/user/passport/logout',
    method: 'get'
})

// 获取用户地址信息
// URL：/api/user/userAddress/auth/findUserAddressList method：get
export const reqAddressInfo = () => requests({
    url: '/user/userAddress/auth/findUserAddressList',
    method: 'get'
})

// 获取商品页清单信息
// URL： /api/order/auth/trade method:get
export const reqOrderInfo = () => requests({
    url: "/order/auth/trade",
    method: 'get'
})

// 提交订单的接口
// URL：/api/order/auth/submitOrder?tradeNo={tradeNo} method：post
export const reqSubmitOrder = (tradeNo, data) => requests({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,  // 通过query传递参数，拼接到了url地址中
    data,
    method: 'post'
})

// 获取支付信息
// URL：/api/payment/weixin/createNative/{orderId}  GET
export const reqPayInfo = (orderId) => requests({
    url: `/payment/weixin/createNative/${orderId}`,
    method: 'get'
})

// 获取支付订单状态
// url: /api/payment/weixin/queryPayStatus/{orderId}   method: get
export const reqPayStatus = (orderId) => requests({
    url: `/payment/weixin/queryPayStatus/${orderId}`,
    method: 'get',
})

// 获取个人中心的数据
// url：/api/order/auth/{page}/{limit} get
// page表示当前第几页  limit表示当前限制展现的商品的个数
// 服务器通过相应的k 拿到相应的v 这一点很关键
export const reqMyOrderList = (page, limit) => requests({
    url: `/order/auth/${page}/${limit}`,
    method: 'get'
})