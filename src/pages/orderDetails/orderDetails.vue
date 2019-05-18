<template>
    <div class="wrap">
        <!-- <van-row class="order-tiem text-center">
            下单时间：{{resultInfo.orderInfo.add_time}}
        </van-row> -->
        <!-- 订单状态 -->
        <van-steps :active="orderStatusActive">
            <van-step>下单</van-step>
            <van-step>付款</van-step>
            <van-step>发货</van-step>
            <van-step>收货</van-step>
            <van-step>完成</van-step>
        </van-steps>
        <!-- 地址 -->
        <van-row class="address">
            <van-col span="3" class="text-center">
                <van-icon size="30px" name="location-o" class="address-icon" />
            </van-col>
            <van-col span="21">
                <van-row>
                    {{resultInfo.orderInfo.consignee}} {{resultInfo.orderInfo.mobile}}
                </van-row>
                <van-row>
                    {{resultInfo.orderInfo.full_region}}
                </van-row>
            </van-col>
        </van-row>
        <!-- 订单商品 -->
        <van-row>
            <van-col span="24" class="goods-item" v-for="item in resultInfo.orderGoods" :key="item.id">
                <router-link :to="{path: '/goodsDetails',query: {id: item.goods_id}}">
                    <van-card
                        :num="item.number"
                        :price="item.retail_price"
                        desc="商品描述"  
                        :title="item.goods_name"
                        :thumb="item.primary_pic_url"
                    />
                </router-link>
            </van-col>
            <div class="order">
                <van-row class="order-info">
                    <van-col span="8" class="text">运费：</van-col>
                    <van-col span="16" class="text-right">{{resultInfo.orderInfo.freight_price}}</van-col>
                </van-row>
                <van-row class="order-info">
                    <van-col span="8">实付款(含运费)：</van-col>
                    <van-col span="16" class="text-right order-price">￥{{resultInfo.orderInfo.order_price}}</van-col>
                </van-row>
            </div>
        </van-row>
        <div class="bottom">
            <p>
                订单号：{{resultInfo.orderInfo.order_no}}
            </p>
            <p>
                创建时间：{{resultInfo.orderInfo.add_time}}
            </p>
        </div>
        <div class="fixed">
            <van-button size="small" @click="handelCancelOrder()" v-if="resultInfo.orderInfo.order_status == 0">取消订单</van-button>
            <van-button size="small" @click="handelPrepay()" v-if="resultInfo.orderInfo.order_status == 0">付款</van-button>
            <van-button size="small" @click="handelDeleteOrder()" v-if="resultInfo.orderInfo.order_status == 101">删除订单</van-button>
            <van-button size="small" @click="handelConfirmReceipt()" v-if="resultInfo.orderInfo.order_status == 300">确定收货</van-button>
            <!-- <van-button size="small" :loading="orderId == item.order_id" @click="handelComplaintShow(item.order_id, index)" v-if="resultInfo.orderInfo.order_status == 201 || resultInfo.orderInfo.order_status == 300">投诉</van-button> -->
            <van-button size="small" v-if="resultInfo.orderInfo.order_status == 301">评价</van-button>
        </div>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'orderDetails',
    data () {
        return {
            active: 2,
            resultInfo: {
                orderGoods: [],
                orderInfo: {
                    consignee: '',
                    full_region: '',
                    mobile: '',
                    order_status: 0
                }
            }
        }
    },
    components: {
        
    },
    computed: {
        orderStatusActive: function () {
            if (this.resultInfo.orderInfo.order_status == 0) {
                return 0
            } else if (this.resultInfo.orderInfo.order_status == 201) {
                return 1
            } else if (this.resultInfo.orderInfo.order_status == 300) {
                return 2
            } else if (this.resultInfo.orderInfo.order_status == 301) {
                return 3
            } else {
                return 4
            }
        }
    },
    created: function () {
        this.getInfo()
    },
    mounted: function () {
        
    },
    methods: {
        getInfo () {
            let params = {orderId: this.$route.query.id}
            API.getorderDetail(params).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.resultInfo = _res.data
                }
            })
        },
        handelCancelOrder () { //取消订单
            this.$dialog.confirm({
                title: '标题',
                message: '确定取消此订单？'
            }).then(() => {
                API.getOrderCancelOrder({orderId: this.resultInfo.orderInfo.id}).then((data) => {
                    if (data.data.errno === 0) {
                        this.$toast.success(data.data.data);
                        this.resultInfo.orderInfo.order_status = 101
                    }
                })
            }).catch(() =>{

            })
        },
        handelDeleteOrder () { //删除订单
            this.$dialog.confirm({
                title: '提示',
                message: '确定删除此订单？'
            }).then(() => {
                API.getOrderDeleteOrder({orderId: this.resultInfo.orderInfo.id}).then((data) => {
                    if (data.data.errno == 0) {
                        this.$toast.success(data.data.data);
                        this.$router.push({path: '/order', query: {index: 0}})
                    }
                })
            }).catch(() =>{

            })
        },
        handelPrepay () { //付款
            API.getPayPrepay({orderId: this.resultInfo.orderInfo.id}).then((data) => {
                const _res = data.data
                if (_res.errno === 0) {
                    this.onBridgeReady(_res.data, this.resultInfo.orderInfo.id)
                } else if (_res.errno === 1) {
                    this.$toast.fail(data.data.errmsg);
                } else if (_res.errno === 400) {
                    this.$toast.fail(data.data.errmsg);
                }
            })
        },
        onBridgeReady(data, id){ //微信支付api
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
                        this.$router.push({path:'/orderDetails', query:{id: id}});
                    }else{
                        this.$toast.fail('支付失败');
                        this.$router.push({path:'/orderDetails', query:{id: id}});
                    }
                })
            )
        },
        handelConfirmReceipt () { //确定收货
            this.$dialog.confirm({
                title: '提示',
                message: '此订单确定收货？'
            }).then(() => {
                API.getOrderConfirmOrder({orderId: this.resultInfo.orderInfo.id}).then((data) => {
                    if (data.data.errno === 0) {
                        this.$toast.success(data.data.data);
                        this.resultInfo.list[$index].orderStatus = 402
                        this.orderId = ''
                    }
                })
            }).catch(() =>{
                
            })
        },
        // handelComplaintShow (orderId, $index) { //显示投诉页面
        //     this.touSuFrom.order_id = orderId
        //     this.complaintShow = !this.complaintShow
        // },
        // handelComplaint () {
        //     if (this.touSuFrom.content == '') {
        //         this.cententErrMes = '投诉内容不能为空'
        //         return
        //     }
        //     if (this.touSuFrom.content.length <= 10) {
        //         this.cententErrMes = '投诉内容字数不能小于10个数'
        //         return
        //     }
        //     API.getOrderTouSu(this.touSuFrom).then((data) => {
        //         const _res = data.data
        //         if (_res.errno == 0) {
        //             this.$toast.success(_res.data);
        //             this.complaintShow = false
        //             this.cententErrMes = ''
        //             this.complaintTypeText = '点击选择投诉类型'
        //             this.touSuFrom = {content: '',type_id: '1',order_id: '',order_no: ''}
                    
        //         } else {
        //             this.$toast.fail(_res.data)
        //         }
        //     })
        // },
        // handelComplaintTypeShow () {
        //     this.typeShow = !this.typeShow
        // },
        // onConfirm (value, index) { //确定选着类型
        //     this.complaintTypeText = value
        //     this.typeShow = !this.typeShow
        // },
        // onCancel () { //取消选着类型
        //     this.typeShow = !this.typeShow
        // }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .order-tiem{background: #fff;line-height: 20px;color: #666}
    /* 地址  */
    .address{line-height: 20px;margin-bottom: 10px;padding: 8px 10px;background: #fff;color: #666}
    .address-icon{margin-top: 5px;}
    /* 订单商品 */
    .goods-item{background: #fff;border-bottom: .5px solid #ededed}
    .goods-item:last-child{margin-bottom: 60px;}
    .order, .bottom{padding: 5px 10px;font-size: 12px;color: #666;background: #fff;}
    .order .order-info{line-height: 18px;}
    .order .order-info .order-price{color: #f44}
    .bottom{margin-top: 10px;line-height: 20px;border-radius: 5px;}
    .fixed{position: fixed;left: 0;bottom: 0;width: 100%;line-height: 50px;background: #fff;}
    .fixed button{margin-left: 10px;}
</style>
