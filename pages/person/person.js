// pages/person/person.js
const app = getApp();
import util from '../../utils/util'
// console.log(app.globalData)
Page({
  data: {
    userData: null,
  },
  // 我的订单
  orderList: function (e) {
    wx.navigateTo({
      url: '../orderListt/orderListt?active=' + e.currentTarget.dataset.num,
    })
  },
  // 收货地址
  addressTap: function () {
    wx.navigateTo({
      url: '../address/address',
    })
  },
  // 联系我们
  makePhone() {
    wx.makePhoneCall({
      phoneNumber: app.globalData.phone, //仅为示例，并非真实的电话号码
    })
  },

  //商家入驻
  shopsTap() {
    wx.makePhoneCall({
      phoneNumber: '15735639898', //仅为示例，并非真实的电话号码
    })
  },
  onShow(){
    util.getSetting()
    if (wx.getStorageSync("userData")) {
      this.setData({
        userData: JSON.parse(wx.getStorageSync("userData"))
      })
    }
  },
    /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})