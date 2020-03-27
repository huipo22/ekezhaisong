// pages/goodList/goodList.js
const app = getApp();
import util from '../../utils/util'
let api = require('../../utils/request').default;

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    flag: 1,//active标识
    aFlag: false,//3 降 4 升  默认降
    goodsList: null,
    resourse: app.globalData.resource,//图片域名
    page: 1,
    display:false,
    noneData:'',
    noneImg:'',
  },
  detached() {
    let options = util.getCurrentPageArgs();//url参数
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      categoryId: options.fatherId,
    })
    wx.navigateBack({
      delta: 1
    });
  },
  ready: function () {
    // 默认请求 综合数据
    let options = util.getCurrentPageArgs();//url参数
    wx.showLoading({
      title: '加载中'
    })
    api.goodsList({
      shop_id: app.globalData.shopId,
      category_id: options.categoryId,
      order_type: 1,
      page: app.globalData.page,
    }).then((result) => {
      if (result.data.code == 1) {
        this.setData({
          goodsList: result.data.data,
          display:true
        })
        wx.hideLoading()
      }else if(result.data.code==0){
        wx.hideLoading()
        util.errorTip(result)
        this.setData({
          display:false,
          noneData:result.data.msg,
          noneImg:'../../dist/icon/zanwushuju.png'
        })
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goodSelect(e) {
      wx.navigateTo({
        url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
      })
    },
    // 加载更多
    loadMore(e) {
      let order_type = e.currentTarget.dataset.type;
      let options = util.getCurrentPageArgs();//url参数
      let that = this;
      const oldData = that.data.goodsList;
      this.setData({
        page: this.data.page + 1
      })
      wx.showLoading({ title: '加载中'})
      api.goodsList({
        shop_id: app.globalData.shopId,
        category_id: options.categoryId,
        order_type: order_type,
        page: this.data.page,
      }).then((result) => {
        if (result.data.code == 1) {
          that.setData({
            goodsList: oldData.concat(result.data.data)
          })
          wx.hideLoading();
        } else if (result.data.code == 0) {
          wx.hideLoading();
          util.errorTip(result)
        }
      })
    },
    // 点击切换
    clickNav: function (e) {
      if (e.currentTarget.dataset.flag == 3 || 4) {
        this.setData({
          aFlag: !this.data.aFlag,
        })
      }
      this.setData({
        flag: e.currentTarget.dataset.type
      })
      let orderType = e.currentTarget.dataset.type;
      let options = util.getCurrentPageArgs();//url参数
      api.goodsList({
        shop_id: app.globalData.shopId,
        category_id: options.categoryId,
        order_type: orderType,
        page: app.globalData.page,
      }).then((result) => {
        if (result.data.code == 1) {
          this.setData({
            goodsList: result.data.data
          })
        } else {
          util.errorTip(result)
        }
      })
    }
  },
})