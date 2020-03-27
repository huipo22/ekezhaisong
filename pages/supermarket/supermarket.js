// pages/supermarket.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    resource: app.globalData.resource, //图片域名
    cateList: null, //left
    rightList: null, //right
    loadFlag: true,
    toView: '',
    scrollTop: 0,
    status: 0,
    result: null,
    flag: false,
    goodIndex: 0
  },
  imgTap: function (e) {
    const cateId = e.currentTarget.dataset.categoryid;
    const fatherId = e.currentTarget.dataset.fatherid
    wx.navigateTo({
      url: '../goodList/goodList?categoryId=' + cateId + "&fatherId=" + fatherId,
    })
  },

  // left click
  leftClick(e) {
    let categoryId = e.currentTarget.dataset.num;
    let index = e.currentTarget.dataset.index
    this.loadSub(categoryId, index)
  },
  loadSub(categoryId, index) {
    this.setData({
      loadFlag: true,
    })
    api.subCategories({
      category_id: categoryId,
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          rightList: res.data.data,
          goodIndex: index,
          loadFlag: false
        })
      } else {
        wx.showToast({
          title: '无更多数据',
          duration: 1500,
          mask: false,
        });
      }
    })
  },
  scrollCate(e) {
    let scrollTop = e.detail.scrollTop;

  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  // 锚点选中
  getStatus(e) {
    this.setData({
      status: e.currentTarget.dataset.index,
      flag: false,
    })
  },
  // 箭头
  showPopup() {
    let flag = this.data.flag
    this.setData({
      flag: !flag
    })
  },
  // 添加购物车
  addCart(e) {
    util.addCart(e, app)
    util.queryCart(app)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 默认
    // left
    // console.log(app)

    api.homeCategory({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          cateList: res.data.data,
        })
        if (app.globalData.indexObj !== null) {
          let categoryId = app.globalData.indexObj.parentId;
          let index = app.globalData.indexObj.index
          this.loadSub(categoryId, index)
        } else {
          // right
          this.loadList(res.data.data[goodIndex].id)
        }
      }
    })
},
loadList(categoryId) {
  this.setData({
    loadFlag: true
  })
  api.subCategories({
    category_id: categoryId,
  }).then((res) => {
    if (res.data.code == 1) {
      this.setData({
        rightList: res.data.data,
        loadFlag: false,
      })
    } else {
      this.setData({
        loadFlag: false
      })
      // wx.showToast({
      //   title: '无更多数据',
      //   duration: 1500,
      //   mask: false,
      // });
    }
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
  app.globalData.indexObj = null
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