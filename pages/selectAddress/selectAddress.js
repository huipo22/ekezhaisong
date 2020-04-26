// pages/selectAddress/selectAddress.js
let app = getApp()
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
  },
  selectedAddress(e) {
    const addressInfo = e.currentTarget.dataset.address
    wx.setStorageSync('switchData', addressInfo);
    api.defaultAddress({
      id: addressInfo.id
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": 'wxapp',
    }).then((result) => {

    })
    wx.navigateBack({
      delta: 1
    });
  },

  // 添加新地址
  newAddress() {
    wx.navigateTo({
      url: '../editAddress/editAddress',
    })
  },
  // 授权地址
  getAddress() {
    let that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address']) {
          wx.chooseAddress({
            success(res) {
              console.log(res)
              // 发送数据
              that.postData(res)
            }
          })
        } else {
          if (res.authSetting['scope.address'] == false) {
            wx.openSetting({
              success(res) {
                console.log(res.authSetting)
              }
            })
          } else {
            wx.chooseAddress({
              success(res) {
                console.log(res)
                that.postData(res)
              }
            })
          }
        }
      }
    })
  },
  // 请求数据
  postData(res) {
    let obj = {
      name: res.userName,
      mobile: res.telNumber,
      // mobile: "13279200819",
      address: res.detailInfo,
      county: res.countyName,
      city: res.cityName,
      province: res.provinceName,
    }
    api.addAddress({
      obj
    }, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": 'wxapp',
    }).then(result => {

    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    api.addressList({}, {
      "Token": wx.getStorageSync("token"),
      "Device-Type": 'wxapp',
    }).then((result) => {
      that.setData({
        addressList: result
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