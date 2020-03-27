// pages/settlement/settlement.js
const utils = require("../../utils/util.js");
import md5 from '../../utils/md5.js';
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  pageLifetimes: {
    show() {
      // cart 页面传来的参数
      let option = utils.getCurrentPageArgs();
      this.setData({
        settleData: JSON.parse(option.data)
      })
      if (wx.getStorageSync("switchData")) {
        this.setData({
          parmsData: wx.getStorageSync("switchData")
        })
      };
    },

  },
  detached() {
    console.log(5656565656)
    wx.removeStorageSync("switchData");
  },
  /**
   * 组件的初始数据
   */
  data: {
    date: utils.formatDate(new Date()),
    time: utils.formatTime(new Date()),
    settleData: null,
    resource: app.globalData.resource,
    parmsData: null,
    remark: null,//b备注
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换地址
    address() {
      wx.navigateTo({
        url: '../selectAddress/selectAddress'
      });

    },
    // 日期
    bindDateChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        date: e.detail.value
      })
    },
    // 时间
    bindTimeChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        time: e.detail.value
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
                const result = that.data.settleData.goods_info;
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
      }


    }
  }
})