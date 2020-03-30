const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join('/')
}
const formatTime = date => {
  const hour = date.getHours()
  const minute = date.getMinutes()
  return [hour, minute].map(formatNumber).join(':')
  // return [hour, minute, second].map(formatNumber).join(':') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
let api = require('./request').default;
const app = getApp();
// url参数
const getCurrentPageArgs = () => {
  const pages = getCurrentPages();
  const currentPage = pages[pages.length - 1];
  const url = currentPage.route;
  const options = currentPage.options;
  return options
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const searchTap = () => {
  wx.navigateTo({
    url: '../search/search',
  })
}
// 删除数组中某一项
const arrayRemoveItem = (arr, delVal) => {
  if (arr instanceof Array) {
    var index = arr.indexOf(delVal);
    if (index > -1) {
      return arr.splice(index, 1);
    }
  }
}
// 是否授权
const getSetting = () => {
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) {
        return
      } else {
        wx.navigateTo({
          url: '../login/login'
        })
      }
    }
  })
}
// 判断库存
const isNum = (goodNum, goodsNum) => {
  if (goodNum >= goodsNum) {
    wx.showToast({
      title: '库存不足',
      duration: 1000,
    });
    return
  }
}
// 错误提示
const errorTip = (res) => {
  wx.showToast({
    title: res.data.msg,
    icon: 'none',
    duration: 1500,
    mask: false,
  });

}
const login = () => {
  wx.login({
    success: res => {
      let wxCode = res.code;
      wx.getUserInfo({
        success(res) {
          let wxData = res;
          wx.request({
            url: "https://hr.jishanhengrui.com/api/wxapp/public/login",
            data: {
              code: wxCode,
              encrypted_data: wxData.encryptedData,
              iv: wxData.iv,
              raw_data: wxData.rawData,
              signature: wxData.signature
            },
            header: {
              'AppId': 'wx1c2c5d708d0c4ea9' // 默认值
            },
            success(res) {
              if (res.data.code == 1) {
                console.log(res);
                wx.setStorageSync('token', res.data.data.token)
                const app = getApp()
                api.cartNum({
                  shop_id: app.globalData.shopId,
                }, {
                  Token: wx.getStorageSync('token'),
                  "Device-Type": 'wxapp',
                }).then((res) => {
                  if (res.data.code == 1) {
                    // 购物车右上角数量
                    let sum = res.data.data.sum;
                    if (sum !== 0) {
                      wx.setTabBarBadge({
                        index: 2,
                        text: String(sum)
                      })
                    } else {
                      wx.removeTabBarBadge({
                        index: 2,
                      });
                    }
                  }
                })
              }
            },
            fail(err) {
              console.log(err)
            }
          })
        }
      })
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
    }
  })
}
// 加入购物车接口
const addCart = (e, app, query) => {
  let goodId = e.currentTarget.dataset.goodid;
  api.cartAdd({
    goods_id: goodId,
    shop_id: app.globalData.shopId
  }, {
    Token: wx.getStorageSync('token'),
    "Device-Type": 'wxapp',
  }).then((res) => {
    if (res.data.code == 1) {
      wx.showToast({
        title: '加入购物车成功',
        icon: "none",
        duration: 1000
      })
      query(app)
    } else if (res.data.code == 10001) {
      wx.navigateTo({
        url: '../login/login'
      })
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: "none",
        duration: 1200
      })
    }
  })
}
// tab 购物车徽章
const queryCart = (app) => {
  api.cartNum({
    shop_id: app.globalData.shopId,
  }, {
    Token: wx.getStorageSync('token'),
    "Device-Type": 'wxapp',
  }).then((res) => {
    if (res.data.code == 1) {
      // 购物车右上角数量
      let sum = res.data.data.sum;
      if (sum !== 0) {
        wx.setTabBarBadge({
          index: 2,
          text: String(sum)
        })
      } else {
        wx.removeTabBarBadge({
          index: 2,
        });
      }
    }
  })
}
// 购物车tab链接
const cartLink = () => {
  wx.switchTab({
    url: '../Ccart/Ccart',
  })
}
module.exports = {
  formatDate: formatDate,
  formatTime: formatTime,
  searchTap: searchTap,
  getCurrentPageArgs: getCurrentPageArgs,
  arrayRemoveItem: arrayRemoveItem,
  getSetting: getSetting,
  login: login,
  isNum: isNum,
  errorTip: errorTip,
  addCart: addCart,
  cartLink: cartLink,
  queryCart: queryCart
}