<template>
    <div class="wrap">
        <!-- 分类 -->
        <div class="tabs">
            <van-tabs v-model="active" color="#f8b551" @click="handelGetGoodsTypeInfo">
                <van-tab v-for="item in resultInfo.type" :key="item.id" :title="item.type"></van-tab>
            </van-tabs>
        </div>
        <!-- 商品 -->
        <div class="goods-wrap">
            <div class="goods">
                <div class="goods-item" v-for="item in typeGoodsList" :key="item.gid">
                    <img :src="item.picUrl" :alt="item.goodsName">
                    <div class="item-goods-info">
                        <p class="title">{{item.goodsName}}</p>
                        <p class="pic">
                            ￥{{item.goodsPrice}}
                            <span class="repository">存库{{item.stockNum}}</span>
                        </p>
                    </div>
                    <van-button @click="handelAddCart(item)" type="danger" class="add-cart-btn">
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
        >
            <span class="cart-num">
                购物车（{{totalCartNumber}}）
            </span>
            <!-- <span slot="tip">
                你的收货地址不支持同城送, <span>修改地址</span>
            </span> -->
        </van-submit-bar>
        <van-popup v-model="paySuccessShow" position="bottom" class="overlay" :overlay="true">
            <div class="pay-success-info text-center">
                <van-icon @click="handleClose" class="close" name="close" />
                <van-row>
                    <van-col span="24" class="user-avatar">
                        <img :src="PaySuccessInfo.img" alt="头像">
                    </van-col>
                    <van-col span="24" class="user-name">
                        {{PaySuccessInfo.nickname}}
                    </van-col>
                </van-row>
                <van-row class="line">
                    {{PaySuccessInfo.getBlance}}
                </van-row>
                <van-row class="line">
                    总积分：{{PaySuccessInfo.total}}
                </van-row>
                <van-row class="botton">
                    <van-button @click="handleGoMall" plain type="primary">去商城换礼品</van-button>
                </van-row>
            </div>
        </van-popup>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'index',
    data () {
        return {
            active: 0,
            settlementShow: false,
            resultInfo: {
                ad: '',
                list: [],
                type: []
            },
            typeGoodsList: [],
            cartList: [],
            paySuccessShow: false,
            PaySuccessInfo: {
                
            }
        }
    },
    components: {
        
    },
    created: function () {
        this.getInfo()
        this.getCookieCartList()
    },
    mounted: function () {
        
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
    methods: {
        getInfo () {
            let params = {machineId: $cookies.get('mId')}
            API.getMachineShopIndex(params).then((data) => {
                const _res = data.data
                if (_res.errno === 0 ) {
                    _res.data.list.map(item => {
                        item.number = 1
                    })
                    this.resultInfo = _res.data
                    this.resultInfo.list.forEach(item => { //分类商品
                        if (_res.data.type[0].id === item.typeId) {
                            this.typeGoodsList.push(item)
                        }
                    })
                }
            })
        },
        getCookieCartList () {  //获取本地购物车数据
            this.cartList = $cookies.get('cartList') ? JSON.parse($cookies.get('cartList')) : []
        },
        handelGetGoodsTypeInfo ($index, title) {
            this.typeGoodsList = []
            this.resultInfo.list.forEach(item => {
                if (this.resultInfo.type[$index].id == item.typeId) {
                    this.typeGoodsList.push(item)
                }
            })
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
         //删除购物车某件商品
        handelDeleteCartItem (gid) {
            for (let i=0;i<this.cartList.length;i++) {
                if (this.cartList[i].gid === gid) {
                    this.cartList.splice(i, 1)
                }
            }
            $cookies.set('cartList',JSON.stringify(this.cartList))
        },
          //查看
        handelSettlement () {
            this.settlementShow = !this.settlementShow
        },
        //提交订单
        handelSubmitOrder () {
            let params = {data: '',machineId: $cookies.get('mId')}
            //处理数据
            this.cartList.forEach(item => {
                params.data += String(item.gid) + '-' +  String(item.number) + ','
            })
            // 下单
            API.getMachineShopSubmit(params).then((data) => {
                const _res = data.data
                if (_res.errno === 0) {
                    this.$toast.success(_res.errmsg)
                    let params = {orderId: _res.data}
                    // 获取微信支付参数
                    API.getMachineShopPrepay(params).then((data) => {
                        const _ress = data.data
                        if (_ress.errno === 0) {
                            // 调用微信支付
                            this.onBridgeReady(_ress.data, _res.data)
                        }
                    })
                } else {
                    this.$toast.fail('订单提交失败')
                }
            })
        },
        //微信支付
        onBridgeReady(data, orderId){
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
                "appId": data.appId,
                "timeStamp": data.timeStamp,
                "nonceStr":  data.nonceStr,
                "package": data.package,
                "signType": data.signType,
                "paySign": data.paySign
              },
              ((res) => {
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                    // alert(orderId)
                   this.getPaySuccessInfo(orderId)
                //   this.showHiddenLoding = false
                //   this.$router.push('/stayDetailsToBePaid/' + id);
                }else{
                    alert(orderId)
                //   this.showHiddenLoding = false
                //   this.$message({
                //     type: 'error',
                //     text:'支付失败',
                //   });
                //   this.$router.push('/stayDetailsToBePaid/' + id);
                }
              })
            )
        },
        getPaySuccessInfo (orderId) {
            API.getPaySuccess({id: orderId}).then((data) => {
                this.paySuccessShow = true
                this.PaySuccessInfo = data.data.data
            })
        },
        handleGoMall () {
            this.$router.push('/')
        },
        handleClose () {
            this.paySuccessShow = false
        }
    },
    watch: {
        
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #eff4f6;overflow-y: scroll;}
    /* tabs */
    .tabs{position: fixed;z-index: 1;left: 0;top: 0;width: 100%;}
    /* 商品 */
    .goods-wrap {display: flex;display: -webkit-flex;flex-direction: column;padding-top: 45px;padding-bottom: 50px;}
    .goods{width: 100%;height: auto;display: flex;display: -webkit-flex;justify-content: space-between;flex-direction: row;flex-wrap: wrap;}
    .goods-item{position: relative;margin: 5px;width: 30%;height: 170px;border-radius: 8px;overflow: hidden;background: #fff;}
    .goods-item img{display: block;width: 100%;height: 120px;}
    .item-goods-info{padding: 0 4px;line-height: 22px;}
    .item-goods-info .title{font-size: 16px;font-weight: bold;color: #474456;}
    .item-goods-info .pic{font-size: 13px;color: #ff571d}
    .item-goods-info .pic .repository{font-size: 10px;color: #d0d0d0}
    .add-cart-btn{position: absolute;bottom: 8px;right:2px;width: 30px;height: 30px;padding: 0;border-radius: 50%;font-size: 20px;background: #f8b551;border-color: #f8b551;}
    .add-cart-btn .icon{top: -3px;color: #614c2e}
    .cart-num{padding-left: 5px;font-size: 18px;font-weight: bolder;color: #474456}
    .goods-item-hide{opacity: 0;}
    /* 弹出 */
    .cart-wrap{height: 450px;padding: 20px;background: #fff;border-radius: 20px;}
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
    .overlay{height: 100vh;}
    .pay-success-info{position: relative;height: 100%;padding: 20px 0}
    .pay-success-info .user-avatar img{width: 80px;height: 80px;border-radius: 50%;}
    .pay-success-info .user-name{margin-bottom: 10px;line-height: 30px;font-size: 16px;font-weight: bold;}
    .line{line-height: 20px;}
    .botton{position: absolute;bottom: 50px;left: 0;right: 0;}
    .close{position: absolute;top: 10px; right:10px;font-size: 30px;color: #ccc}
</style>