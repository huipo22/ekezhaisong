// pages/address/address.js
let app = getApp()
let util = require('../../utils/util')
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  pageLifetimes: {
    show() {
      this.readyData()
    }
  },
  /**
   * 组件的初始数据
   */

  data: {
    addressList: [],
  },


  /**
   * 组件的方法列表
   */
  methods: {
    // 初始数据加载
    readyData() {
      let that = this
      wx.request({
        url: app.globalData.host + '/api/goods/address/list_address',
        method: "GET",
        header: {
          "Token": wx.getStorageSync("token"),
          "Device-Type": 'wxapp',
        },
        success(res) {
          if (res.data.code == 1) {
            that.setData({
              addressList: res.data.data
            })

          } else {
            util.errorTip(res)
          }
        }
      })
    },
    // 默认地址
    radioTap(e) {
      let that = this
      wx.request({
        url: app.globalData.host + "/api/goods/address/default_address",
        method: "POST",
        header: {
          "Token": wx.getStorageSync("token"),
          "Device-Type": 'wxapp',
        },
        data: {
          id: e.target.dataset.id
        },
        success(res) {
          if (res.data.code == 1) {
            that.readyData()
            wx.showToast({
              title: '设置成功',
              icon: 'none',
              duration: 1500,
              mask: false,
            });
          } else {
            util.errorTip(res)
          }
        }
      })
    },
    // 删除地址
    deleteTap(e) {
      let that = this;
      wx.showModal({
        title: '提示',
        content: '确认删除改收获地址?',
        success(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.request({
              url: app.globalData.host + "/api/goods/address/delete_address",
              method: "POST",
              header: {
                "Token": wx.getStorageSync("token"),
                "Device-Type": 'wxapp',
              },
              data: {
                id: e.currentTarget.dataset.id
              },
              success(res) {
                if (res.data.code == 1) {
                  that.readyData()
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
    // 编辑地址
    editTap(e) {
      console.log(e)
      wx.navigateTo({
        url: '../editAddress/editAddress?addressInfo=' + JSON.stringify(e.currentTarget.dataset.info),
      })
    },
    // 添加新地址
    newAddress() {
      wx.navigateTo({
        url: '../editAddress/editAddress',
      })
    }
  }
})
