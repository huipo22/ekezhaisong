let host = 'https://hr.jishanhengrui.com' // 设置API接口的ip地址和端口
let host1 = "https://www.jishanhengrui.com:8091" //新的host 地址
const app = getApp()
console.log(app)
let apiList = {
    platform: host + "/api/goods/shop/service", //平台服务
    wheel: host + "/api/goods/shop/wheels", //轮播图
    typeGoods: host + "/api/goods/goods/type_goods", //首页分类
    globalPhone: host + "/api/home", //全局手机号
    category: host + "/api/goods/Categories", // 分类接口
    categoryList: host + "/api/goods/Categories/subCategories", //分类详情
    goodsList: host + "/api/goods/goods/index", //商品列表
    goodDetail:host+"/api/goods/goods/goods_detail",//商品详情,
    homeCategory:host+"/api/goods/goods/parent_category",//首页分类
    subCategories:host+"/api/goods/categories/subCategories",//子分类及商品
    cartAdd:host+"/api/goods/shopcar/add",//添加购物车
    cartIndex:host+"/api/goods/shopcar/index",//购物车查询
    cartDelete:host+"/api/goods/shopcar/remove",//购物车删除
    cartNum:host+"/api/goods/shopcar/get_sum",//查询购物车数量
    cartAction:host+"/api/goods/shopcar/action",//购物车加减
    createOrder:host+"/api/goods/order/create_order",//创建订单
    goodSub:host+"/api/goods/goods/goods_good",//商品推荐
    getOrder:host+"/api/goods/order/order_status",//获取订单
    orderRefund:host+"/api/goods/order/order_refund",//取消订单
}

module.exports = apiList; //暴露出来