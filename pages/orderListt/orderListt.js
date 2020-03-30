// pages/orderListt/orderListt.js
let app = getApp();
const util = require('../../utils/util')
import md5 from '../../utils/md5.js';
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderActive: 1,
    orderListTab: [{
        name: 1,
        title: "待付款"
      },
      {
        name: 2,
        title: "待发货"
      },
      {
        name: 3,
        title: "待收货"
      },
      {
        name: 4,
        title: "已完成"
      },
      {
        name: 5,
        title: "已退款"
      },
    ],
    loadFlag:true,
    resourse: app.globalData.resource,
    orderListData: []
  },
  // 加载订单数据
  loadOrdernData(status) {
    this.setData({
      loadFlag:true
    })
    api.getOrder({
      shop_id: app.globalData.shopId,
      status: status
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          orderListData: res.data.data,
          loadFlag:false
        })
      }
    })
  },
  // 订单选项卡改变事件
  orderChange(event) {
    console.log(event)
    console.log(this.data.orderActive)
    const status = event.detail.name
    this.setData({
      orderActive: event.detail.name
    })
    this.loadOrdernData(status)
  },
  // 取消
  cancel(e) {
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否取消该订单',
      success(res) {
        if (res.confirm) {
          api.orderRefund({
            order_id: Number(e.target.id),
            shop_id: app.globalData.shopId
          }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
          }).then((res) => {
            if (res.data.code == 1) {
              wx.showToast({
                title: '订单已取消',
                icon: 'success',
                duration: 2000
              })
              console.log(that.data.orderActive)
              that.loadOrdernData(that.data.orderActive)
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 付款
  pay(e) {
    console.log(e)
    let order = e.target.dataset.order
    let that=this
    // return;
    wx.request({
      url: app.globalData.host + "/api/goods/order/wxapp_pay",
      method: "POST",
      header: {
        "Token": wx.getStorageSync("token"),
        "Device-Type": "wxapp"
      },
      data: {
        order_id: order.id,
        address_id: order.add_id,
        price: order.pay_price,
        remark: ''
      },
      success(res) {
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
            // 支付成功 删缓存 订单页支付
            that.setData({
              orderActive: 2,
            })
            that.loadOrdernData(2)
           
          },
          fail(res) {
            console.log('调用支付接口fail', res)
            that.setData({
              orderActive:1,
            })
            that.loadOrdernData(1)
          }
        })
      },
    })
  },
  // 退款
  backPay(e) {
    console.log(e)
    let that = this
    wx.showModal({
      title: '提示',
      content: '是否需要退款',
      success(res) {
        if (res.confirm) {
          api.orderRefund({
            order_id: Number(e.target.id),
            shop_id: app.globalData.shopId
          }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
          }).then((res) => {
            if (res.data.code == 1) {
              that.setData({
                orderList: res.data.data
              })
              util.errorTip(res)
              wx.showModal({
                title: '提示',
                content: '退款成功',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    that.setData({
                      orderActive:5,
                    })
                    that.loadOrdernData(5)
                  }
                }
              })
            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消');
          return
        }
      }
    })
  },
  goodLink(e){
    console.log(e)
    const id=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + id,
    })
  } ,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.active) {
      this.setData({
        orderActive: Number(options.active)
      })
      this.loadOrdernData(Number(options.active))
    } else {
      this.loadOrdernData(1)
    }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.switchTab({
      url: '../person/person',
    });
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