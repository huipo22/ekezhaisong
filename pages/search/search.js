// pages/search/search.js
const app = getApp();
const util=require("../../utils/util")
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  pageLifetimes: {
    show() {
      this.setData({
        inputShowed: true
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    inputShowed: false,
    goodList: null,
    resource: app.globalData.resource
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showInput: function () {
      this.setData({
        inputShowed: true
      });
    },
    hideInput: function () {
      this.setData({
        inputVal: "",
        inputShowed: false
      });
      wx.navigateBack({
        delta: 1
      });

    },
    clearInput: function () {
      this.setData({
        inputVal: ""
      });
      // getList(this);
    },
    inputTyping: function (e) {
      //搜索数据
      wx.request({
        url: app.globalData.host + '/api/goods/goods/search',
        method: 'GET',
        data: {
          shop_id: app.globalData.shopId,
          goods_name: e.detail.value,
          page: 1
        },
        success: (res) => {
          if (res.data.code == 1) {
            this.setData({
              goodList: res.data.data,
            })
          }else{
            util.errorTip(res)
          }
        },
      })
      this.setData({
        inputVal: e.detail.value
      });
    },
    // 商品链接
    goodSelect(e) {
      wx.navigateTo({
        url: '../goodDetail/goodDetail?goodId='+e.currentTarget.dataset.goodid,
      })
    },
    // 加载更多
    loadMore() {
      let that = this;
      const oldData = that.data.goodsList;
      wx.showLoading({
        title: '玩命加载中',
      })
      wx.request({
        url: app.globalData.host + '/api/goods/goods/index',
        data: {
          shop_id: app.globalData.shopId,
          goods_name: that.data.inputVal,
          page: app.globalData.page + 1,
        },
        method: 'GET',
        success: (result) => {
          if (result.data.code == 1) {
            that.setData({
              goodsList: oldData.concat(result.data.data)
            })
            wx.hideLoading();
          } else {
            wx.showToast({
              title: '无更多数据',
              duration: 1500,
              mask: false,
            });
          }
        },
      });
    },
  }
})