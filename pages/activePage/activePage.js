// pages/activePage.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    active: 1,
    goodType: [],
    goodGoods: [],
    resourse: app.globalData.resource, //图片域名
  },
  goodType() {
    const that = this;
    api.goodType().then((result) => {
      that.setData({
        goodType: result
      })
      that.goodGoods(result[0].id)
    })
  },
  goodGoods(goodid) {
    const that = this;
    api.goodGoods({
      good_id: goodid
    }, {}).then((result) => {
      that.setData({
        goodGoods: result,
      })
    })
  },
  goodIdActive(e) {
    const status = e.currentTarget.dataset.id
    this.setData({
      active: status,
    })
    this.goodGoods(status)
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: encodeURI('../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid),
    })
  },
  // 添加购物车
  addCart(e) {
    let goodId = e.currentTarget.dataset.goodid;
    api.cartAdd({
      goods_id: goodId,
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      wx.showToast({
        title: '加入购物车成功',
        icon: "none",
        duration: 1000
      })
      // 查询购物车
      util.queryCart(this)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let option = util.getCurrentPageArgs();
    const typeId = option.typeId
    this.setData({
      active: typeId,
    })
    this.goodType(typeId)
    this.cartQ(app)
    let me = this;
    const query = wx.createSelectorQuery();
    query.select("#tab").boundingClientRect(function (res) {
      console.log(res)
      me.data.tabTop = res.bottom + res.height
    }).exec()
  },
  // 购物车链接
  cartLink() {
    util.cartLink()
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  cartQ(app) {
    let that = this;
    api.cartNum({
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((result) => {
      that.setData({
        cartInfo: result.sum
      })
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  onPageScroll(e) {
    let me = this;
    // console.log(e.scrollTop)
    if (e.scrollTop > me.data.tabTop + 40) {
      if (me.data.tabFix) {
        return
      } else {
        me.setData({
          tabFix: 'Fixed',
          flag: false,
        })
      }
    } else {
      me.setData({
        tabFix: '',
        flag: true
      })
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})