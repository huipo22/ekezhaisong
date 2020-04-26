// pages/platform/platform.js
const app = getApp()
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    platformList: [],
    resourse: app.globalData.resource, //图片域名
  },
  // 拨打电话
  call(e) {
    console.log(e)
    const phone = e.currentTarget.dataset.phonenumber
    wx.makePhoneCall({
      phoneNumber: phone,
    })
  },
  // 放大图片
  preview(event) {
    console.log(event)
    let currentUrl = event.currentTarget.dataset.src
    let imgList = []
    imgList.push(currentUrl)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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
    api.platfromServe().then((result) => {
      this.setData({
        platformList: result
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