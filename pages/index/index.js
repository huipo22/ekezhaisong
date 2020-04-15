//index.js
//获取应用实例
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;

Page({
  data: {
    imgUrls: [], //轮播图
    shopsData: null, //商品分类
    resourse: app.globalData.resource, //图片域名
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "#00a046", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 2000, //间隔时间
    duration: 400, //滑动时间
    cateList: null, //6列数据
    recommend: null,
    take: '',
    active: 1,
    goodType: [],
    goodGoods: [],
    flag: true,
    flag1: null,
  },
  zhibo() {
    console.log(454545)
    wx.navigateTo({
      url: "plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=2"
    })
  },
  receiveValue(res) {
    this.setData({
      flag1: res.detail
    })
  },
  onShow() {
    // 全局手机号
    api.globalPhone({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        const result = res.data.data;
        console.log(result)
        app.globalData.phone = result.user_phone;
        app.globalData.start_time = result.start_time
        app.globalData.end_time = result.end_time
        wx.setNavigationBarTitle({
          title: "e刻宅送",
        })
        this.setData({
          take: result.take
        })
        let currentTime = Math.round(new Date().getTime() / 1000).toString();
        console.log(currentTime + "-" + result.start_time)
        if (currentTime < result.start_time || currentTime > result.end_time) {
          wx.reLaunch({
            url: "../close/close"
          })
        } else {
          console.log('在范围内')
        }
      }
    }).then(() => {
      this.wheel()
    }).then(() => {
      this.column()
    }).then(() => {
      this.goodType()
    }).then(() => {
      util.queryCart(app)
    })
    let me = this;
    const query = wx.createSelectorQuery();
    query.select("#tab").boundingClientRect(function (res) {
      console.log(res)
      me.data.tabTop = res.bottom + res.height
    }).exec()

  },
  wheel() {
    const that = this;
    // 轮播图
    api.wheel({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          imgUrls: res.data.data
        })
      }
    })
  },
  goodType() {
    const that = this;
    api.goodType().then((res) => {
      if (res.data.code == 1) {
        that.setData({
          goodType: res.data.data
        })
        that.goodGoods(res.data.data[0].id)
      }
    })
  },
  goodGoods(goodid) {
    const that = this;
    api.goodGoods({
      good_id: goodid
    }, {}).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          goodGoods: res.data.data,
        })
      }
    })
  },
  // goodChange(event) {
  //   const status = event.detail.name
  //   this.setData({
  //     active: status
  //   })
  //   this.goodGoods(status)
  // },
  goodIdActive(e) {
    const status = e.currentTarget.dataset.id
    this.setData({
      active: status,
    })
    this.goodGoods(status)
  },

  goodR() {
    const that = this;
    // 好物推荐
    api.goodSub().then((res) => {
      if (res.data.code == 1) {
        that.setData({
          recommend: res.data.data
        })
      }
    })
  },
  column() {
    const that = this;
    // 首页5列数据
    api.homeCategory({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        that.setData({
          cateList: res.data.data
        })
      }
    })
  },
  onLoad(options) {
    if (options && options.shopId) {
      getApp().globalData.shopId = options.shopId;
      wx.setStorageSync('shopId', options.shopId)
    } else {
      wx.setStorageSync('shopId', '1')
    }
    app.globalData.shopId = wx.getStorageSync('shopId')

  },
  goodDetailTap: function (e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
  // 矩阵跳转
  link(e) {
    console.log(e)
    const parentname = e.currentTarget.dataset.parentname;
    const parentid = e.currentTarget.dataset.parentid
    wx.navigateTo({
      url: '../listPage/listPage?parentId=' + parentid + '&cateId=' + parentname
    })
  },
  // 添加购物车
  addCart(e) {
    util.addCart(e, app, util.queryCart)
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: encodeURI('../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid),
    })
  },
  onPageScroll(e) {
    let me = this;
    // console.log(e.scrollTop)
    if (e.scrollTop > me.data.tabTop + 40) {
      if (me.data.tabFix) {
        return
      } else {
        me.setData({
          tabFix: 'Fixed',
          flag: false,
        })
      }
    } else {
      me.setData({
        tabFix: '',
      })
      if (me.data.flag1 == null) {
        me.setData({
          flag: true
        })
      } else {
        me.setData({
          flag: me.data.flag1
        })
      }
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})