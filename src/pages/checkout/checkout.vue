<template>
    <div class="wrap">
        <router-link to="/address">
            <van-row class="address">
                <van-col span="22">
                    <van-col span="24">
                        <van-row>
                            <van-col span="4" class="text-center">{{resultInfo.checkedAddress.userName}}</van-col>
                            <van-col span="20">{{resultInfo.checkedAddress.telNumber}}</van-col>
                        </van-row>
                    </van-col>
                    <van-col span="24">
                        <van-col span="4" class="text-center">
                            <van-tag size="medium" plain color="#f2826a">默认</van-tag>
                        </van-col>
                        <van-col span="20">{{resultInfo.checkedAddress.full_region}}</van-col>
                    </van-col>
                </van-col>
                <van-col span="2" class="icon">
                    <van-icon name="arrow" />
                </van-col>
            </van-row>
        </router-link>
        <!-- 优惠券 -->
        <!-- <van-row>
            <van-coupon-cell
                :coupons="coupons"
                :chosen-coupon="chosenCoupon"
                @click="showList = true"
            />
        </van-row> -->
        <!-- 总计 -->
        <van-row class="goods-inof">
            <van-row class="item">
                <van-col span="12">商品合计</van-col>
                <van-col span="12" class="text-right">￥{{resultInfo.goodsTotalPrice}}</van-col>
            </van-row>
            <van-row class="item">
                <van-col span="12">运费</van-col>
                <van-col span="12" class="text-right">￥{{resultInfo.freightPrice}}</van-col>
            </van-row>
            <van-row class="item">
                <van-col span="24">
                    <van-field v-model="postscript" placeholder="留言" />
                </van-col>
            </van-row>
            <!-- <van-row class="item">
                <van-col span="12">优惠券</van-col>
                <van-col span="12" class="text-right">￥{{resultInfo.goodsTotalPrice}}</van-col>
            </van-row> -->
        </van-row>
        <van-row>
            <van-col span="24" v-for="item in resultInfo.checkedGoodsList" :key="item.id" class="goods-item">
                <router-link :to="{path: '/goodsDetails',query: {id: item.goods_id}}">
                    <van-card
                        :num="item.number"
                        :price="item.retail_price"
                        :desc="item.goods_specifition_name_value"  
                        :title="item.goods_name"
                        :thumb="item.list_pic_url"
                    />
                </router-link>
            </van-col>
        </van-row>
        <van-submit-bar
            :price="resultInfo.orderTotalPrice * 100"
            button-text="提交订单"
            @submit="handelSubmitOrder"
        />
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'checkout',
    data () {
        return {
            // 优惠券
            // showList: false,
            // chosenCoupon: -1,
            // coupons: [coupon],
            // disabledCoupons: [coupon]
            resultInfo: {
                checkedAddress: {},
                freightPrice: null,
                goodsTotalPrice: null,
                orderTotalPrice: null
            },
            postscript: '',
        }
    },
    computed: {
        // totalPrice: function () {
        //     let money = this.resultInfo.orderTotalPrice
        //     money += '00'
        //     return parseInt(money)
        // },
    },
    created: function () {
        this.getInfo()
    },
    mounted: function () {
        
    },
    methods: {
        getInfo () {
            let params = {type: this.$route.query.type, productId: this.$route.query.productId, number: this.$route.query.number}
            API.getCartCheckout(params).then((data) => {
                const _res = data.data
                if (_res.errno === 0) {
                    this.resultInfo = _res.data
                }
                console.log(this.resultInfo)
            })
        },
        handelSubmitOrder () {//提交订单
            //判断是否有收货地址
            if (typeof(this.resultInfo.checkedAddress) == 'string') {
                this.$toast.fail(this.resultInfo.checkedAddress)
                return
            }
            //提交参数
            let params = {
                    type: this.$route.query.type,
                    postscript: this.postscript,
                    addressId: this.resultInfo.checkedAddress.id,
                    productId: this.$route.query.productId ? this.$route.query.productId : '',
                    number: this.$route.query.number ? this.$route.query.number : ''
                }
            API.getOrderSubmit(params).then((data) => { //提交订单
                const _res = data.data
                if (_res.errno === 0) {
                    let params = {orderId: _res.data.orderInfo.id}
                    API.getPayPrepay(params).then((data) => { //获取支付参数
                        const _ress = data.data
                        if (_ress.errno === 0) {
                            this.onBridgeReady(_ress.data, _res.data.orderInfo.id) //调用微信支付api
                        }
                    })
                }
            })
        },
        onBridgeReady(data, id){ //微信支付 data: 支付参数，id：订单id
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
                        this.$toast.success('支付成功');
                        this.$router.replace({path:'/orderDetails', query:{id: id}});
                    }else{
                        this.$toast.fail('支付失败');
                        this.$router.replace({path:'/orderDetails', query:{id: id}});
                    }
                })
            )
        }
    }
}
</script>
<style scoped>
    /* 地址 */
   .wrap{background: #f4f4f4;height: 100%;}
   .address{line-height: 20px;margin-bottom: 10px;padding: 8px 10px;background: #fff;color: #666}
   .address .icon{line-height: 40px;font-size: 20px;}
   /* 合计 */
   .goods-inof{margin-bottom: 10px;padding: 0 10px;line-height: 40px;background: #fff;color: #333;}
   .goods-inof .item{border-bottom: .5px solid #ededed;}
   .goods-inof .item:last-child{border: none;}
   .goods-item{background: #fff;margin-bottom: 10px;}
   .goods-item:last-child{margin-bottom: 60px;}
   .van-cell{padding-left: 0}
</style>














