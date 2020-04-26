//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;

Page({
  data: {
    imgUrls: [], //轮播图
    shopsData: null, //商品分类
    resourse: app.globalData.resource, //图片域名
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "#00a046", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 2000, //间隔时间
    duration: 400, //滑动时间
    cateList: null, //6列数据
    recommend: null,
    take: '',
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
      // util.queryCart(app)
    })

  },
  wheel() {
    const that = this;
    // 轮播图
    api.wheel({
      shop_id: app.globalData.shopId
    }).then((result) => {
      that.setData({
        imgUrls: result
      })
    })
  },

  goodR() {
    const that = this;
    // 好物推荐
    api.goodSub().then((result) => {
      that.setData({
        recommend: result
      })
    })
  },
  column() {
    const that = this;
    // 首页5列数据
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