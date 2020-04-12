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
    flag:true
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
    })
    let me = this;
    const query = wx.createSelectorQuery();
    query.select("#tab").boundingClientRect(function (res) {
      console.log(res)
      me.data.tabTop = res.bottom+res.height
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
          goodGoods: res.data.data
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
  goodIdActive(e){
    const status = e.currentTarget.dataset.id
    this.setData({
      active: status
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
  test() {
    wx.requestSubscribeMessage({
      tmplIds: ['nh6KXiwir1vr3rWRnZ_Wg6-gn_cGmEoVth1pnzGpqkE'],
      success(res) {
        console.log(res)
        if (res['nh6KXiwir1vr3rWRnZ_Wg6-gn_cGmEoVth1pnzGpqkE'] == 'accept') {
          console.log('已授权接收订阅消息')
          api.wxActivity({}, {}).then(res => {
            console.log(res)
          })
        }
      }
    })
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
    console.log(e.scrollTop)
    if (e.scrollTop > me.data.tabTop+40) {
      if (me.data.tabFix) {
        return
      } else {
        me.setData({
          tabFix: 'Fixed',
          flag:false,
        })
      }
    } else {
      me.setData({
        tabFix: '',
        flag:true
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})