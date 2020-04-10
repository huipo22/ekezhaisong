//app.js
let util = require('./utils/util')
App({
  onLaunch: function (options) {
    // 这个是通过  小程序码，或者二维码 获取参数 方式
    if (options && options.shopId) {
      getApp().globalData.shopId = options.shopId;
      wx.setStorageSync('shopId', options.shopId)
    } else {
      wx.setStorageSync('shopId', '1')
    }
    this.globalData.shopId = wx.getStorageSync('shopId')
    // 场景值
    console.log(options)

    // 登录
    util.login()
  },
  globalData: {
    userInfo: null,
    page: 1, //分页默认
    shopId: null, //商家id,
    phone: null,
    // logoImg:'../../dist/icon/logo.jpg',
    logoImg: 'https://hr.jishanhengrui.com/upload/service/logo.jpg',
    host: 'https://hr.jishanhengrui.com', //域名
    resource: 'https://hr.jishanhengrui.com/upload/', //图片资源地址
    sum: 0,
    start_time: '',
    end_time: ''
  }
})