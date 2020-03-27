// pages/person/person.js
const app = getApp();
const utils = require('../../utils/util')
console.log(app.globalData)
Component({
  attached() {
    if (wx.getStorageSync("userData")) {
      this.setData({
        userData: JSON.parse(wx.getStorageSync("userData"))
      })
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready() {
    utils.getSetting()
  },
  /**
   * 组件的初始数据
   */
  data: {
    userData: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 我的订单
    orderList: function (e) {
      wx.navigateTo({
        url: '../orderList/orderList?id=' + e.currentTarget.dataset.num,
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
    }
  },
})
