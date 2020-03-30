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
  },
  onShow() {
    util.queryCart(app)
    // 全局手机号
    api.globalPhone({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        wx.setNavigationBarTitle({
          // title: res.data.data.user_nickname
          title: "e刻宅送"
        })
        app.globalData.phone = res.data.data.user_phone
      } else {
        util.errorTip(res)
      }
    })
    // 轮播图
    api.wheel({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          imgUrls: res.data.data
        })
      } else {
        util.errorTip(res)
      }
    })
    // 好物推荐
    api.goodSub().then((res) => {
      if (res.data.code == 1) {
        this.setData({
          recommend: res.data.data
        })
      }
    })
    // 首页5列数据
    api.homeCategory({
      shop_id: app.globalData.shopId
    }).then((res) => {
      if (res.data.code == 1) {
        this.setData({
          cateList: res.data.data
        })
      }
    })
    util.queryCart(app)

  },

  onLoad(query) {
    if (query && query.shopId) {
      getApp().globalData.shopId = query.shopId;
      wx.setStorageSync('shopId', query.shopId)
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
    const parentname=e.currentTarget.dataset.parentname;
    const parentid=e.currentTarget.dataset.parentid
    wx.navigateTo({
      url:'../listPage/listPage?parentId='+parentid+'&cateId='+parentname
    })
  },
  // 添加购物车
  addCart(e) {
    util.addCart(e, app,util.queryCart)
  },
  // 商品链接
  goodSelect(e) {
    wx.navigateTo({
      url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
    })
  },
})