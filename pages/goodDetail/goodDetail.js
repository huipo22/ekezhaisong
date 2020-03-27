// pages/goodDetail/goodDetail.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;

Page({
  data: {
    resourse: app.globalData.resource, //图片域名
    goodDetailData: null, //购物车数据
    isCartTrue: false, //弹出框
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: false, //是否自动轮播
    interval: 1500, //间隔时间
    duration: 400, //滑动时间
    rich: '',
    cartInfo: null,
  },
  onShow() {
    // 查询购物车数量
    api.cartNum({
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if(res.data.code==1){
        this.setData({
          cartInfo:res.data.data.sum
        })
      }
    })
  },

  onLoad(options) {
    let that = this;
    // 商品详情数据请求
    api.goodDetail({
      goods_id: options.goodId
    }).then((res) => {
      if (res.data.code == 1) {
        let rich = res.data.data.goods_detail.replace(/\<p><img/gi, '<img class="richImg" ')
        that.setData({
          goodDetailData: res.data.data,
          rich: rich
        })
      }
    })

  },
  // 购物车链接
  cartLink() {
    util.cartLink()
  },
  // 添加购物车
  addCart(e) {
    util.addCart(e, app)
    // 查询购物车数量
    api.cartNum({
      shop_id: app.globalData.shopId
    }, {
      Token: wx.getStorageSync('token'),
      "Device-Type": 'wxapp',
    }).then((res) => {
      if(res.data.code==1){
        this.setData({
          cartInfo:res.data.data.sum
        })
      }
    })
  },
  // 点击预览图片
  previewImage(e) {
    const current = e.target.dataset.src;
    let imgUrls = [];
    const imgList = this.data.goodDetailData.banners;
    for (let i in imgList) {
      let allSrc = this.data.resourse + imgList[i].url
      imgUrls.push(allSrc)
    }
    wx.previewImage({
      current: current,
      urls: imgUrls,
    })
  }
})