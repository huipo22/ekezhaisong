// pages/selectAddress/selectAddress.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {},
  pageLifetimes: {
    show() {
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
          }
        }
      })
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
    selectedAddress(e) {
      wx.setStorageSync('switchData', e.currentTarget.dataset.address);
      wx.request({
        url: app.globalData.host + "/api/goods/address/default_address",
        method: "POST",
        header: {
          "Token": wx.getStorageSync("token"),
          "Device-Type": 'wxapp',
        },
        data: {
          id: e.currentTarget.dataset.address.id
        },
        success(res) {
          if (res.data.code == 1) {
          }
        }
      })
      wx.navigateBack({
        delta: 1
      });
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
      wx.request({
        url: app.globalData.host + '/api/goods/address/add_address',
        method: "POST",
        header: {
          "Token": wx.getStorageSync("token"),
          "Device-Type": 'wxapp',
        },
        data: obj,
        success(result) {
          if (result.data.code == 1) {
            let addressId = result.data.data;
          } else if (result.data.code == 0) {
            wx.showToast({
              title: result.data.msg,
              icon: 'none',
              duration: 1500
            });

          }
        }
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
    }
  }
})
