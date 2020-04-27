// pages/search/search.js
const app = getApp();
const util = require('../../utils/util')
let api = require('../../utils/request').default;
Page({
  data: {
    goodList: null,
    resourse: app.globalData.resource,
    inputVal: '',
    noneFlag: false,
    page: 1
  },
  inputTyping: function (e) {
    //搜索数据
    api.search({
      shop_id: app.globalData.shopId,
      goods_name: e.detail,
      page: 1
    }, {}).then(result => {
      this.setData({
        goodList: result,
        inputVal: e.detail,
        page: 1,
      })
    })
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  // 加载更多
  loadMore() {
    let that = this;
    let oldData = that.data.goodList;
    var pp = that.data.page + 1
    api.search({
      shop_id: app.globalData.shopId,
      goods_name: that.data.inputVal,
      page: pp,
    }, {}).then(result => {
      console.log(result)
      if (result == 0) {
        that.setData({
          noneFlag: true
        })
      } else {
        that.setData({
          goodsList: oldData.concat(result),
          noneFlag: false,
          page: pp,
        })
      }
    })
  },
  // 添加购物车
  addCart(e) {
    util.addCart(e, app, util.queryCart)
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  onShow() {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})