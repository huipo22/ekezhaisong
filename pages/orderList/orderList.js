// pages/orderList/orderList.js
let app = getApp();
const util = require('../../utils/util')

import md5 from '../../utils/md5.js';
Component({
  ready() {
    let option = util.getCurrentPageArgs();
    this.setData({
      sign: option.id
    })
    let that = this
    this.getOrder(that, that.data.sign)
  },
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    sign: 1,
    orderList: null,
    resouce: app.globalData.resource
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 获取订单
    getOrder(that, sign) {
      wx.request({
        url: app.globalData.host + "/api/goods/order/order_status",
        method: "POST",
        header: {
          "Token": wx.getStorageSync("token"),
          "Device-Type": "wxapp",
        },
        data: {
          shop_id: app.globalData.shopId,
          status: sign
        },
        success(res) {
          console.log(res)
          if (res.data.code == 1) {
            that.setData({
              orderList: res.data.data
            })
          } else {
            util.errorTip(res)
          }
        }
      })
    },
    clickNav(e) {
      this.setData({
        sign: e.currentTarget.dataset.num
      })
      let that = this
      this.getOrder(that, that.data.sign)
    },
    // 取消
    cancel(e) {
      let that = this
      wx.showModal({
        title: '提示',
        content: '是否取消该订单',
        success(res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            wx.request({
              url: app.globalData.host + "/api/goods/order/order_refund",
              method: "POST",
              header: {
                "Token": wx.getStorageSync("token"),
                "Device-Type": "wxapp"
              },
              data: {
                order_id: Number(e.target.id),
                shop_id: app.globalData.shopId
              },
              success(res) {
                console.log(res)
                if (res.data.code == 1) {
                  wx.showToast({
                    title: '订单已取消',
                    icon: 'success',
                    duration: 2000
                  })
                  that.getOrder(that, that.data.sign)
                  // that.setData({
                  //   orderList: res.data.data
                  // })
                } else {
                  util.errorTip(res)
                }
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
              const result = order.goods_info;
              const storage = wx.getStorageSync('cartData');
              for (let i in storage) {
                for (let j in result) {
                  if (storage[i].data.goods_id == result[j].goods_id) {
                    utils.arrayRemoveItem(storage, storage[i])
                  }
                }
              }
              wx.setStorageSync('cartData', storage)
              wx.navigateTo({
                url: '../orderList/orderList?id=2'
              })
            },
            fail(res) {
              console.log('调用支付接口fail', res)
              wx.navigateTo({
                url: '../orderList/orderList?id=1'
              })
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
            // console.log('用户点击确定')
            wx.request({
              url: app.globalData.host + "/api/goods/order/order_refund",
              method: "POST",
              header: {
                "Token": wx.getStorageSync("token"),
                "Device-Type": "wxapp"
              },
              data: {
                order_id: Number(e.target.id),
                shop_id: app.globalData.shopId
              },
              success(res) {
                console.log(res)
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
                        // console.log('用户点击确定')
                        wx.navigateTo({
                          url: '../orderList/orderList?id=5'
                        })
                      }
                    }
                  })
                } else {
                  util.errorTip(res)
                }
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消');
            return
          }
        }
      })
    }
  }
})