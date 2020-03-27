// pages/editAddress/editAddress.js
let app = getApp();
const utils = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  pageLifetimes: {
    show() {
      //收货地址 页面传来的参数
      let option = utils.getCurrentPageArgs();
      console.log(option)
      if (Object.keys(option).length == 0) {
        return
      } else {
        let Address = JSON.parse(option.addressInfo)
        this.setData({
          id: Address.id,
          province: Address.province,
          city: Address.city,
          county: Address.county,
          name: Address.name,
          mobile: Address.mobile,
          address: Address.address,
          region: [Address.province, Address.city, Address.county]
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    id: null,
    province: null,
    city: null,
    county: null,
    region: null,
    name: null,
    mobile: null,
    address: null,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // name
    nameChange(e) {
      this.setData({
        name: e.detail.value
      })
    },
    // mobile
    mobileChange(e) {
      this.setData({
        mobile: e.detail.value
      })
    },
    // region
    bindRegionChange: function (e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        region: e.detail.value
      })
    },
    // address
    addressChange(e) {
      this.setData({
        address: e.detail.value
      })
    },
    // save
    saveTap(e) {
      // add address
      if (e.currentTarget.dataset.id == null) {
        wx.request({
          url: app.globalData.host + "/api/goods/address/add_address",
          method: "POST",
          header: {
            "Token": wx.getStorageSync("token"),
            "Device-Type": 'wxapp',
          },
          data: {
            name: this.data.name,
            mobile: this.data.mobile,
            address: this.data.address,
            province: this.data.region[0],
            city: this.data.region[1],
            county: this.data.region[2]
          },
          success(res) {
            if (res.data.code == 1) {
              wx.showToast({
                title: '保存成功',
                duration: 1500,
                success: (result) => {
                  wx.navigateTo({
                    url: '../address/address',
                  });
                },
              });
            }
          }
        })
      } else {
        // update adress
        wx.request({
          url: app.globalData.host + "/api/goods/address/update_address",
          method: "POST",
          header: {
            "Token": wx.getStorageSync("token"),
            "Device-Type": 'wxapp',
          },
          data: {
            id: e.currentTarget.dataset.id,
            name: this.data.name,
            mobile: this.data.mobile,
            address: this.data.address,
            province: this.data.region[0],
            city: this.data.region[1],
            county: this.data.region[2]
          },
          success(res) {
            if (res.data.code == 1) {
              wx.showToast({
                title: '保存成功',
                duration: 1500,
                success: (result) => {
                  wx.navigateTo({
                    url: '../address/address',
                  });
                },
              });
            }else{
              utils.errorTip(res)
            }
          }
        })
      }
    }
  }
})
