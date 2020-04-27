// pages/listPage/listPage.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cateData: null,
    resource: app.globalData.resource, //图片域名
    page: 1,
    loadFlag: true,
    cartInfo: 0,
    noneFlag:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  onLoad: function (options) {
    console.log(options)
    const cateid = decodeURI(options.parentId)
    wx.setNavigationBarTitle({
      title: decodeURIComponent(options.cateId)
    })
    api.subCategories({
      category_id: cateid,
      page: 1
    }).then((result) => {
        this.setData({
          loadFlag: false,
          cateData: result,
          categoryId: cateid,
        })
    })
  },
  // 加载更多
  loadMore(e) {
    let categoryId = this.data.categoryId;
    const oldData = this.data.cateData;
    var pp = this.data.page + 1
    api.subCategories({
      category_id: categoryId,
      page: pp
    }).then((result) => {
        if (result==0) {
          this.setData({
            noneFlag:true
          })
        } else {
          this.setData({
            cateData: oldData.concat(result),
            page: pp,
            noneFlag:false,
          })
        }
    })
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
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
    // 查询购物车数量
    this.cartQ(app)
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