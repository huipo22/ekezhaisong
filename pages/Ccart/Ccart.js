// pages/cart/cart.js
const app = getApp()
import util from '../../utils/util'
let api = require('../../utils/request').default;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        resourse: app.globalData.resource, //图片域名
        carts: [],
        totalPrice: 0,
        isAllSelect: false,
        totalMoney: 0,
        selectNum: 0
    },
    // 商品详情
    detailPage(e) {
        const goodId = e.currentTarget.dataset.goodid
        util.navigateTo('../detail/detail?goodId=' + goodId)
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getTotalPrice()
    },
    // 选择药品函数
    switchSelect: function (e) {
        const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
        let carts = this.data.carts; // 获取购物车列表
        let selectNum = 0; //统计选中商品
        const isSelect = carts[index].isSelect; // 获取当前商品的选中状态
        carts[index].isSelect = !isSelect; // 改变状态
        for (let i = 0; i < carts.length; i++) {
            if (carts[i].isSelect) {
                selectNum++
            }
        }
        if (selectNum == carts.length) {
            this.setData({
                isAllSelect: true
            })
        } else {
            this.setData({
                isAllSelect: false
            })
        }
        this.setData({
            carts: carts,
            selectNum: selectNum
        })
        this.getTotalPrice()
    },
    //单个删除
    singleDelete(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let shoppingId = carts[index].id
        let that = this
        wx.showModal({
            content: '确定删除商品?',
            success(res) {
                if (res.confirm) {
                    that.cartDelete(shoppingId)
                    util.queryCart(app)
                } else if (res.cancel) {
                    return
                }
            }
        })
    },
    // 购物车删除
    cartDelete(shoppingId) {
        api.cartDelete({
            shopping_id: shoppingId
        }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
        }).then((res) => {
            if (res.data.code == 1) {
                wx.showToast({
                    title: '删除商品成功',
                    icon: 'none',
                    duration: 1500
                });
                this.cartQuery()
            }
        })
    },
    // 加减接口
    cartOption(e, carts, index, num) {
        api.cartAction({
            action: e.target.id,
            shopping_id: carts[index].id,
            goods_id: carts[index].goods_id
        }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
        }).then((res) => {
            if (res.data.code == 1) {
                carts[index].num = num
                this.setData({
                    carts: carts
                })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none',
                    duration: 1500
                });
                return
            }
        })
    },
    // 商品增加或减少
    quantityChange(e) {
        const index = e.currentTarget.dataset.index;
        let carts = this.data.carts;
        let num = carts[index].num;
        let shoppingId = carts[index].id
        let that = this;
        if (e.target.id == 'dec') {
            if (num == 1) {
                wx.showModal({
                    content: '确定删除商品?',
                    success(res) {
                        if (res.confirm) {
                            that.cartDelete(shoppingId);
                            util.queryCart(app)
                        } else if (res.cancel) {
                            return
                        }
                    }
                })
                return
            } else {
                num -= 1
                this.cartOption(e, carts, index, num)
                util.queryCart(app)
                this.getTotalPrice()
            }

        } else if (e.target.id == 'inc') {
            num += 1
            this.cartOption(e, carts, index, num)
            util.queryCart(app)
            this.getTotalPrice()
        }



    },
    // 计算总价函数
    getTotalPrice() {
        let carts = this.data.carts; // 获取购物车列表
        let total = 0;
        for (let i = 0; i < carts.length; i++) { // 循环列表得到每个数据
            if (carts[i].isSelect) { // 判断选中才会计算价格
                total += carts[i].num * carts[i].present_price; // 所有价格加起来
            }
        }
        this.setData({ // 最后赋值到data中渲染到页面
            carts: carts,
            totalMoney: total.toFixed(2)
        });
    },
    // 商品全选
    selectAll() {
        let that = this
        let selectNum = 0; //统计选中商品
        let isAllSelect = that.data.isAllSelect; // 是否全选状态
        isAllSelect = !isAllSelect;
        let carts = that.data.carts;
        for (let i = 0; i < carts.length; i++) {
            carts[i].isSelect = isAllSelect; // 改变所有商品状态
            if (carts[i].isSelect) {
                selectNum++
            }
        }
        that.setData({
            isAllSelect: isAllSelect,
            carts: carts,
            selectNum: selectNum
        });
        that.getTotalPrice(); // 重新获取总价
    },
    // 结算事件
    endTap() {
        let carts = this.data.carts;
        const chooseGoods = carts.filter((obj) => {
            return obj.isSelect == true
        })
        console.log(chooseGoods)
        if (chooseGoods.length == 0) {
            wx.showModal({
                content: '请选择商品',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#00a046',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    }
                }
            })
        } else {
            const chooseList = chooseGoods.map((obj) => {
                return {
                    goods_id: obj.goods_id,
                    present_price: obj.present_price,
                    num: obj.num
                }
            })

            api.createOrder(
                chooseList, {
                    "Token": wx.getStorageSync("token"),
                    "Device-Type": 'wxapp',
                    "content-type": "application/json"
                }).then((res) => {
                if (res.data.code == 1) {
                    wx.navigateTo({
                        url: "../settlement/settlement?data=" + JSON.stringify(res.data.data),
                    })
                } else if (res.data.code == 0) {
                    wx.showToast({
                        title: res.data.msg,
                        icon: 'none',
                        duration: 1500
                    });
                }
            })
        }
    },
    // 商品链接
    goodSelect(e) {
        wx.navigateTo({
            url: '../goodDetail/goodDetail?goodId=' + e.currentTarget.dataset.goodid,
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    cartQuery() {
        let that = this
        api.cartIndex({
            shop_id: app.globalData.shopId
        }, {
            "Token": wx.getStorageSync("token"),
            "Device-Type": "wxapp"
        }).then((res) => {
            if (res.data.code == 1) {
                that.setData({
                    carts: res.data.data
                })
                that.selectAll()
            }
        })
    },
    onShow: function () {
        // 查询购物车
        this.cartQuery()
        util.queryCart(app)
    }
})