//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;

Page({
  data: {
    imgUrls: [], //轮播图
    resourse: app.globalData.resource, //图片域名
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "#00a046", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 2000, //间隔时间
    duration: 400, //滑动时间
    cateList: null, //6列数据
    take: '',
    time: 30 * 60 * 60 * 1000,
    secondData: null, //限时抢购
    thirdData: null, //第三方店铺
    goodType: null, //三个活动
  },
  zhibo() {
    wx.navigateTo({
      url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=2"
    })
  },
  onShow() {
    // 全局手机号
    api.globalPhone({
      shop_id: app.globalData.shopId
    }).then((result) => {
      app.globalData.phone = result.user_phone;
      wx.setNavigationBarTitle({
        title: "e刻宅送",
      })
      this.setData({
        take: result.take
      })
      // 关闭页面链接
      let currentTime = Math.round(new Date().getTime() / 1000).toString();
      console.log(currentTime + "-" + result.start_time)
      if (currentTime < result.start_time || currentTime > result.end_time) {
        wx.reLaunch({
          url: "../close/close?start=" + result.start_time + "&end=" + result.end_time
        })
      } else {
        console.log('在范围内')
      }
    }).then(() => {
      this.wheel()
    }).then(() => {
      this.column()
    }).then(() => {
      this.secondFun()
    }).then(() => {
      this.thirdFun()
    }).then(() => {
      this.goodType()
    })

  },
  //三个活动
  goodType() {
    const that = this;
    api.goodType().then((result) => {
      that.setData({
        goodType: result
      })
    })
  },
  // 活动链接
  activeTap(e) {
    const typeId = e.currentTarget.dataset.typeid
    console.log(typeId)
    wx.navigateTo({
      url: '../activePage/activePage?typeId=' + typeId,
    })
  },
  // 轮播图
  wheel() {
    const that = this;
    api.wheel({
      shop_id: app.globalData.shopId
    }).then((result) => {
      that.setData({
        imgUrls: result
      })
    })
  },
  // 限时抢购
  secondFun() {},
  //第三方店铺
  thirdFun() {},
  // 限时抢购链接
  secondLink(e) {
    const goodId = e.currentTarget.dataset.goodid
    console.log(goodId)
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + goodId,
    })
  },
  // 第三方店铺链接
  thirdLink(e) {
    const shopId = e.currentTarget.dataset.shopid
    console.log(shopId)
    wx.navigateTo({
      url: '../shop/shop?shopId=' + shopId,
    })
  },
  // 首页5列数据
  column() {
    const that = this;
    api.homeCategory({
      shop_id: app.globalData.shopId
    }).then((result) => {
      that.setData({
        cateList: result
      })
    })
  },
  onLoad(options) {
    if (options && options.shopId) {
      getApp().globalData.shopId = options.shopId;
      wx.setStorageSync('shopId', options.shopId)
    } else {
      wx.setStorageSync('shopId', '1')
    }
    app.globalData.shopId = wx.getStorageSync('shopId')

  },

  // 矩阵跳转
  link(e) {
    console.log(e)
    const parentname = e.currentTarget.dataset.parentname;
    const parentid = e.currentTarget.dataset.parentid
    wx.navigateTo({
      url: '../listPage/listPage?parentId=' + parentid + '&cateId=' + parentname
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})