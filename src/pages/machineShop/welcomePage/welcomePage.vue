<template>
    <div class="wrap">
        <!-- 轮播 -->
        <!-- <div class="banner-wrap">
            <van-swipe :autoplay="3000" :loop="true">
                <van-swipe-item>
                    <img :src="resultInfo.ad" alt="fasf">
                </van-swipe-item>
            </van-swipe>
        </div> -->
        <!-- 视频 -->
        <div>
            <video id="videoPlay" style="object-fit: fill;" x-webkit-airplay="true"  playsinline="true" x5-video-player-type="h5" x5-video-player-fullscreen="true" width="100%" preload="auto" :src="resultInfo.ad">视频无法播放：视频地址有误</video>
            <!-- <video :src="resultInfo.ad" id="videoPlay" x5-video-player0type="h5" width="100%" loop>您的浏览器不支持视屏播放。</video> -->
        </div>
        <!-- 分类 -->
        <!-- <van-tabs v-model="active" color="#28a9ff" @click="handelGetGoodsTypeInfo">
            <van-tab title="分类"></van-tab>
            <van-tab title="分类"></van-tab>
            <van-tab title="分类"></van-tab>
            <van-tab title="分类"></van-tab>
            <van-tab title="分类"></van-tab>
        </van-tabs> -->
        <!-- 商品 -->
        <div class="goods-wrap">
            <div class="goods">
                <div class="goods-item" v-for="item in resultInfo.list" :key="item.gid">
                    <img :src="item.picUrl" :alt="item.goodsName">
                    <div class="item-goods-info">
                        <p class="title">{{item.goodsName}}</p>
                        <p class="pic">
                            ￥{{item.goodsPrice}}
                            <span class="repository">存库{{item.stockNum}}</span>
                        </p>
                    </div>
                    <van-button type="danger" @click="handelAddCart(item)" class="add-cart-btn">
                        <van-icon class="icon" name="cart" />
                    </van-button>
                </div>
                <div class="goods-item goods-item-hide"></div>
                <div class="goods-item goods-item-hide"></div>
            </div>
        </div>
        <!-- 弹出层 -->
        <van-popup position="bottom" v-model="settlementShow">
            <div class="cart-wrap">
                <van-row class="header">
                    <van-col span="12" class="title">已选中商品</van-col>
                    <van-col span="12" class="text-right">
                        <span class="del" @click="handelDeleteCart"><van-icon name="delete" />清空</span>
                    </van-col>
                </van-row>
                <van-row class="goods-list">
                    <van-row class="list-item" v-for="(item, index) in cartList" :key="index">
                        <van-col span="14">
                            {{item.goodsName}}
                        </van-col>
                        <van-col span="10" class="text-right goods-number">
                            <span class="item-pic">￥{{item.goodsPrice * item.number}}</span>
                            x{{item.number}}
                            <span class="del" @click="handelDeleteCartItem(item.gid)">删除</span>
                        </van-col>
                    </van-row>
                </van-row>
            </div>
            <van-submit-bar
                :price="totalPrice"
                button-text="结算"
                :loading="submitOrderLoading"
                @submit="handelSubmitOrder"
                button-type="warning"
                :disabled="btnDisabled"
            >
                <span class="cart-num">
                    购物车（{{totalCartNumber}}）
                </span>
                <!-- <span slot="tip">
                    你的收货地址不支持同城送, <span>修改地址</span>
                </span> -->
            </van-submit-bar>
        </van-popup>
        <!-- 总计结算 -->
        <van-submit-bar
            :price="totalPrice"
            button-text="查看"
            @submit="handelSettlement"
            button-type="warning"
            :disabled="btnDisabled"
            v-show="!btnDisabled"
        >
            <span class="cart-num">
                购物车（{{totalCartNumber}}）
            </span>
            <!-- <span slot="tip">
                你的收货地址不支持同城送, <span>修改地址</span>
            </span> -->
        </van-submit-bar>
        <div class="more text-center" :class="{'active': !btnDisabled}">
            <van-button @click="handelMoreGoods" class="more-btn" size="small" type="default">更多产品</van-button>
        </div>
    </div>
</template>

<script>
import API from '@/api/index'
import utils from '@/utils/utils'
export default {
    name: 'vendingMachine',
    data () {
        return {
            active: 0,
            settlementShow: false,
            resultInfo: {
                ad: '',
                list: [],
                type: []
            },
            cartList: [],
            submitOrderLoading: false,
        }
    },
    components: {
        
    },
    computed: {
        totalCartNumber: function () {
            return this.cartList.length
        },
        totalPrice: function () {
            let money = 0
            this.cartList.forEach(item => {
                money += item.goodsPrice * item.number
            })
            money *= 100
            return parseInt(money)
        },
        btnDisabled: function () {
            return this.cartList.length == 0
        }
    },
    created: function () {
        this.getInfo()
        this.getCookieCartList()
    },
    mounted: function () {
        this.videoPlay()
    },
    methods: {
        getInfo () { //获取数据this.machineId
            API.getMachineShopIndex({machineId: $cookies.get('mId')}).then((data) => {
                const _res = data.data
                if (_res.errno === 0 ) {
                    if (_res.errmsg != '执行成功') {
                        this.$toast.fail(_res.errmsg)
                        return
                    }
                    _res.data.list.map(item => {
                        item.number = 1
                    })
                    this.resultInfo = _res.data
                    this.videoPlay()
                } else {
                    
                }
            })
        },
        videoPlay () { //解决微信不能自动播放 WeixinJSBridge：微信浏览器
            let video = document.getElementById('videoPlay')
            if (window.WeixinJSBridge) {
                WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                    video.play()
                }, false)
            } else {
                document.addEventListener("WeixinJSBridgeReady", function () {
                    WeixinJSBridge.invoke('getNetworkType', {}, function (e) {
                        video.play()
                    });
                }, false)
            }
            video.play()
            return false
        },
        getCookieCartList () {  //获取本地购物车数据
            this.cartList = $cookies.get('cartList') ? JSON.parse($cookies.get('cartList')) : []
        },
        handelGetGoodsTypeInfo () {
            
        },
        handelAddCart (item) { //加入购物车
            for (let i=0;i<this.cartList.length;i++) {
                if (item.gid == this.cartList[i].gid) { //购物车是否有该商品
                    for (let j=0;j<this.resultInfo.list.length;j++) {   //循环展示商品
                        if (item.gid == this.resultInfo.list[j].gid) {  //取当前点击商品
                            if (this.cartList[i].number < this.resultInfo.list[j].stockNum) {   //判断该商品存库信息
                                this.cartList[i].number++
                                $cookies.set('cartList',JSON.stringify(this.cartList))
                                return
                            } else {
                                this.$toast.fail('存库不足')
                                return
                            }
                        }
                    }
                }
            }
            this.cartList.push(item)
            $cookies.set('cartList',JSON.stringify(this.cartList))
        },
        handelMoreGoods () { //更多
            this.$router.push({path:'/machineIndex'})
        },
        handelDeleteCart () { //清空购物车
            this.$dialog.confirm({
                title: '提示',
                message: '确定要清空已选商品？'
            }).then(() => {
                $cookies.set('cartList', '')
                this.cartList = []
                this.$toast.fail('已清空')
                this.settlementShow = false
            }).catch(() => {

            })
        },
        handelDeleteCartItem (gid) { //删除购物车某件商品
            for (let i=0;i<this.cartList.length;i++) {
                if (this.cartList[i].gid === gid) {
                    this.cartList.splice(i, 1)
                }
            }
            $cookies.set('cartList',JSON.stringify(this.cartList))
        },
        handelSettlement () {  //查看
            this.settlementShow = !this.settlementShow
        },
        handelSubmitOrder () {  //提交订单
            this.submitOrderLoading = true
            let params = {data: '',machineId: $cookies.get('mId')}
            this.cartList.forEach(item => {
                params.data += String(item.gid) + '-' +  String(item.number) + ','
            })
            API.getMachineShopSubmit(params).then((data) => { //提交订单
                const _res = data.data
                if (_res.errno === 0) {
                    this.$toast.success(_res.errmsg)
                    $cookies.set('cartList','')
                    this.cartList = []
                    let params = {orderId: _res.data, mId: $cookies.get('mId')}
                    API.getOrder(params).then((data) => {
                        this.submitOrderLoading = false
                    })
                    //API.getMachineShopPrepay(params).then((data) => { //获取支付参数
                    //    const _res = data.data
                    //    if (_res.errno === 0) {
                    //        utils.onBridgeReady(_res.data)
                    //    }
                    //})
                } else {
                    this.$toast.fail('订单提交失败')
                }
            })
        }
    },
    watch: {
        
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #eff4f6;overflow-y: scroll;}
    /* 广告位 */
    .banner-wrap{margin-bottom: 10px;overflow: hidden;background: #fff;}
    .banner-wrap img{width: 100%;height: 100%;}
    /* 商品 */
    .goods-wrap {display: flex;display: -webkit-flex;flex-direction: column;}
    .goods{width: 100%;height: auto;display: flex;display: -webkit-flex;justify-content: space-between;flex-direction: row;flex-wrap: wrap;}
    .goods-item{position: relative;margin: 5px;width: 30%;height: 170px;border-radius: 8px;overflow: hidden;background: #fff;}
    .goods-item:last-child{margin-bottom: 70px;}
    .goods-item img{width: 100%;height: 120px;display: block;}
    .item-goods-info{padding: 0 4px;line-height: 22px;}
    .item-goods-info .title{font-size: 16px;font-weight: bold;color: #474456;}
    .item-goods-info .pic{font-size: 13px;color: #ff571d}
    .item-goods-info .pic .repository{font-size: 10px;color: #d0d0d0}
    .add-cart-btn{position: absolute;bottom: 8px;right:2px;width: 30px;height: 30px;padding: 0;border-radius: 50%;font-size: 20px;background: #f8b551;border-color: #f8b551;}
    .add-cart-btn .icon{top: -3px;color: #614c2e}
    .more{position: fixed;bottom: 10px; left: 0;width: 100%;}
    .more.active{transition: .5s;width: 50px;height: 50px;bottom: 70px;left: 85%;}
    .more.active .more-btn{width: 50px;height: 50px;box-sizing: border-box;font-size: 16px;font-weight: 100;overflow: hidden;}
    .more .more-btn{width: 60%;height: 100%;line-height: 50px;font-size: 20px;font-weight: bold;color: #fff;border-radius: 60px;box-shadow: 0px 5px 10px rgba(248,181,81,.5);background: #f8b551;}
    .cart-num{padding-left: 5px;font-size: 18px;font-weight: bolder;color: #474456}
    .goods-item-hide{opacity: 0;}
    /* 弹出 */
    .cart-wrap{height: 300px;padding: 20px;background: #fff;border-radius: 20px;}
    .cart-wrap .header{height: 10%;}
    .cart-wrap .header .title{color: #d0d0d0;}
    .cart-wrap .header .del{color: #f8b551;}
    .cart-wrap .header .del .van-icon-delete{top: 2px;right: 1px;}
    .goods-list{height: 90%;color: #474456;overflow-x: scroll;}
    .list-item{line-height: 35px;border-bottom: solid .5px #ededed}
    .list-item:last-child{margin-bottom: 40px;}
    .goods-list .list-item .goods-number{color: #f8b551;}
    .goods-list .list-item .item-pic{min-width: 10%;margin-right: 10px;text-align: left!important;}
    .goods-list .list-item .del{padding-left: 5px;color: #474456;}
</style>