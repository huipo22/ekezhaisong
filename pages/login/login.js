// pages/login/login.js
const app = getApp();
let util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    logoImg:app.globalData.logoImg
  },
  detached() {
    wx.reLaunch({
      url: '../index/index',
      success: (result) => {
        // 登录
        util.login()
      },
      fail: () => { },
      complete: () => { }
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getUserInfoFun(e) {
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          wx.setStorage({
            key: 'userData',
            data: res.rawData,
            success: (result) => {

            },
            fail: () => { },
            complete: () => { }
          });

          wx.navigateBack({
            delta: 2
          });
        },
        fail: function (err) {
          return;
        }
      })
    },
  }
})