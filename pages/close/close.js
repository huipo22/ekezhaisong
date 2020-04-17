// pages/close/close.js
const app = getApp();
const util = require('../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    start_time: '',
    end_time: ''
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
    const option = util.getCurrentPageArgs()
    const start = util.formatTime(new Date(parseInt(option.start) * 1000), 'h:m:s')
    const end = util.formatTime(new Date(parseInt(option.end) * 1000), 'h:m:s')
    console.log(start + "****" + end)
    this.setData({
      start_time: start,
      end_time: end
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