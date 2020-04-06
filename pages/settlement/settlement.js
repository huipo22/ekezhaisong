// pages/settlement/settlement.js
const utils = require("../../utils/util.js");
import md5 from '../../utils/md5.js';
let app = getApp();
// pages/close/close.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: utils.formatDate(new Date()),
    time: utils.formatTime(new Date()),
    settleData: null,
    resource: app.globalData.resource,
    parmsData: null,
    remark: null, //b备注
    show: false,
  },
  // 切换地址
  address() {
    wx.navigateTo({
      url: '../selectAddress/selectAddress'
    });

  },
  goodLink(e) {
    console.log(e)
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + id,
    })
  },
  // 提交事件
  submitTap() {
    if (!this.data.settleData.address_info && !this.data.parmsData) {
      wx.showToast({
        title: '请选择收货地址',
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false,
        imgList: []
      });

    } else {
      let addressId = null
      if (this.data.settleData.address_info !== null) {
        addressId = this.data.settleData.address_info.id
      } else if (this.data.parmsData !== null) {
        addressId = this.data.parmsData.id
      } else {
        addressId = null
      }
      console.log(addressId)
      let that = this
      wx.request({
        url: app.globalData.host + "/api/goods/order/wxapp_pay",
        method: "POST",
        header: {
          "Token": wx.getStorageSync("token"),
          "Device-Type": "wxapp"
        },
        data: {
          order_id: this.data.settleData.order_id,
          // address_id: this.data.settleData.address_info.id,
          // address_id: this.data.parmsData.id,
          address_id: addressId,
          price: this.data.settleData.price,
          remark: this.data.remark,
        },
        success(res) {
          console.log(that.data.settleData)
          console.log(res)
          let paySign = md5.hexMD5('appId=' + res.data.data.appid + '&nonceStr=' + res.data.data.nonce_str + '&package=' + res.data.data.prepay_id + '&signType=MD5&timeStamp=' + res.data.data.timeStamp + "&key=n4iif00GHIAS8CFx4XxvWNNfYogZVDbg").toUpperCase();
          wx.requestPayment({
            'timeStamp': res.data.data.timeStamp + "",
            'nonceStr': res.data.data.nonce_str,
            'package': res.data.data.prepay_id,
            'signType': 'MD5',
            'paySign': paySign,
            // 'appId': res.data.data.appid,
            success(res) {
              console.log('调用支付接口成功', res)
              // 支付成功 删缓存
              wx.navigateTo({
                url: '../orderListt/orderListt?active=2'
              })

            },
            fail(res) {
              console.log('调用支付接口fail', res)
              wx.navigateTo({
                url: '../orderListt/orderListt?active=1'
              })
            }
          })
        },
      })
    }
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let option = utils.getCurrentPageArgs();
    this.setData({
      settleData: JSON.parse(option.data)
    })
    const imgList = this.data.settleData.goods_info.map((obj) => {
      return obj.goods_img
    })
    this.setData({
      imgList: imgList
    })
    if (wx.getStorageSync("switchData")) {
      this.setData({
        parmsData: wx.getStorageSync("switchData")
      })
    };
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