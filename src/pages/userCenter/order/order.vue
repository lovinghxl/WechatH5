<template>
    <div class="wrap">
        <div class="tabs">
            <van-tabs @click="handelTypeOrderInfo" v-model="active" color="#28a9ff">
                <van-tab v-for="(item, index) in orderList" :key="index" :title="item.title"></van-tab>
            </van-tabs>
        </div>
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="list"
            v-if="!listLength"
        >
            <div class="list-item" v-for="(item, index) in resultInfo.list" :key="item.order_id">
                <router-link tag="div" :to="{path: '/orderDetails', query: {id: item.order_id}}">
                    <van-card
                        :num="items.number"
                        :price="items.retail_price"
                        :title="items.goods_name"
                        :thumb="items.primary_pic_url"
                        :origin-price="items.retail_price"
                        v-for="items in item.goodsList"
                        :key="items.id"
                    >
                    </van-card>
                </router-link>
                <div class="footer text-right">
                    <div class="total-goods-num">
                        共{{item.goodsCount}}件商品合计:
                        <span>￥{{item.goodsPrice}}</span>
                    </div>
                    <van-button size="small" :loading="orderId == item.order_id" @click="handelCancelOrder(item.order_id, index)" v-if="item.orderStatus == 0">取消订单</van-button>
                    <van-button size="small" :loading="orderIdFk == item.order_id" @click="handelPrepay(item.order_id, index)" v-if="item.orderStatus == 0">付款</van-button>
                    <van-button size="small" :loading="orderId == item.order_id" @click="handelDeleteOrder(item.order_id, index)" v-if="item.orderStatus == 101">删除订单</van-button>
                    <van-button size="small" :loading="orderId == item.order_id" @click="handelConfirmReceipt(item.order_id, index)" v-if="item.orderStatus == 300">确定收货</van-button>
                    <van-button size="small" :loading="orderId == item.order_id" @click="handelComplaintShow(item.order_id, index)" v-if="item.orderStatus == 201 || item.orderStatus == 300">投诉</van-button>
                    <!-- <van-button size="small" v-if="item.orderStatus == 301">评价</van-button> -->
                    <!-- <van-button size="small" :loading="orderId == item.order_id" @click="handelConfirmReceipt(item.order_id, index)" v-if="item.orderStatus == 201 || item.orderStatus == 300">退款/货</van-button> -->
                </div>
            </div>
        </van-list>
        <van-popup v-model="complaintShow" class="overlay100vh">
            <div class="return-wrap">
                <div class="return text-center" @click="handelComplaintShow">
                    <van-icon name="arrow-left" />
                </div>
            </div>
            <div class="complaint-type" @click="handelComplaintTypeShow">
                投诉类型: <span>{{complaintTypeText}}</span>
            </div>
            <van-field :border="true" type="textarea" required :error-message="cententErrMes" v-model="touSuFrom.content" placeholder="请输入投诉内容" />
            <van-button class="fixed" size="large" @click="handelComplaint()" type="primary">提交投诉</van-button>
                <van-popup v-model="typeShow" position="bottom">
                    <van-picker
                        show-toolbar
                        title="标题"
                        :columns="columns"
                        @confirm="onConfirm"
                        @cancel="onCancel"
                    />
                </van-popup>
        </van-popup>
        <div class="tips" v-if="listLength">
            <van-icon name="orders-o" />
            <div class="tips-text">
                你还没有相关的订单
            </div>
        </div>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'order',
    data () {
        return {
            active: 0,
            complaintShow: false,
            orderList: [ //tabs列表
                {title: '全部', state: ''},
                {title: '待付款', state: '0'},
                {title: '待发货', state: '201'},
                {title: '待收货', state: '300'},
                {title: '待评价', state: '301'},
                {title: '退款/货', state: '401'}
            ],
            resultInfo: {
                currentNum: '',
                currentPage: '',
                list: [],
                numsPerPage: '',
                total: '',
                totalPage: '',
            },
            params: {
                page: 1,
                order_status: ''
            },
            //上拉加载更多
            loading: false,
            finished: true,
            //按钮加载动画
            orderId: '',
            orderIdFk: '',
            //投诉
            touSuFrom: {
                content: '',
                type_id: '1',
                order_id: '',
                order_no: ''
            },
            typeShow: false,
            columns: ['发货', '售后'],
            cententErrMes: '',
            complaintTypeText: '点击选择投诉类型'
        }
    },
    components: {
        
    },
    computed: {
        listLength: function () {
            return this.resultInfo.list.length == 0
        }
    },
    created: function () {
        if (this.$route.query.index) {
            this.active = this.$route.query.index
        }
        this.params.order_status = this.orderList[this.active].state
        this.getInfo(this.params, 1)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo (params, type) {
            API.getOrderList(params).then((data) => {
                if (data.status == 200) {
                    if (type == 1) {
                        this.resultInfo = data.data
                        this.finished = false
                    } else {
                        if (data.data.list.length != 0) {
                            this.resultInfo.list = this.resultInfo.list.concat(data.data.list)
                        }
                        this.loading = false
                        if (this.params.page >= data.data.totalPage) {
                            this.finished = true
                        }
                    }
                }
            })
        },
        handelTypeOrderInfo ($index, title) { //$index：当前下标    title: 标题
            if ($index == 4) {
                this.$router.push('/stayEvaluate')
            } else {
                this.params.order_status = this.orderList[$index].state
                this.params.page = 1
                this.getInfo(this.params, 1)
            }
        },
        onLoad() {// 上拉加载更多数据
            setTimeout(() => {
                this.params.page++
                this.getInfo(this.params, 2)
            }, 500);
        },
        handelCancelOrder (orderId, $index) { //取消订单
            this.$dialog.confirm({
                title: '标题',
                message: '确定取消此订单？'
            }).then(() => {
                this.orderId = orderId
                API.getOrderCancelOrder({orderId: orderId}).then((data) => {
                    if (data.data.errno === 0) {
                        this.$toast.success(data.data.data);
                        this.resultInfo.list[$index].orderStatus = 101
                        this.orderId = ''
                    }
                })
            }).catch(() =>{

            })
        },
        handelDeleteOrder (orderId, $index) { //删除订单
            this.$dialog.confirm({
                title: '提示',
                message: '确定删除此订单？'
            }).then(() => {
                this.orderId = orderId
                API.getOrderDeleteOrder({orderId: orderId}).then((data) => {
                    if (data.data.errno == 0) {
                        this.$toast.success(data.data.data);
                        this.resultInfo.list.splice($index, 1)
                        this.orderId = ''
                    }
                })
            }).catch(() =>{

            })
        },
        handelPrepay (orderId, $index) { //付款
            this.orderIdFk = orderId
            API.getPayPrepay({orderId: orderId}).then((data) => {
                const _res = data.data
                if (_res.errno === 0) {
                    this.onBridgeReady(_res.data, orderId)
                } else if (_res.errno === 1) {
                    this.orderIdFk = ''
                    this.$toast.fail(data.data.errmsg);
                } else if (_res.errno === 400) {
                    this.orderIdFk = ''
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
        handelConfirmReceipt (orderId, $index) { //确定收货
            this.$dialog.confirm({
                title: '提示',
                message: '此订单确定收货？'
            }).then(() => {
                this.orderId = orderId
                API.getOrderConfirmOrder({orderId: orderId}).then((data) => {
                    if (data.data.errno === 0) {
                        this.$toast.success(data.data.data);
                        this.resultInfo.list[$index].orderStatus = 402
                        this.orderId = ''
                    }
                })
            }).catch(() =>{
                
            })
        },
        handelComplaintShow (orderId, $index) { //显示投诉页面
            this.touSuFrom.order_id = orderId
            this.complaintShow = !this.complaintShow
        },
        handelComplaint () {
            if (this.touSuFrom.content == '') {
                this.cententErrMes = '投诉内容不能为空'
                return
            }
            if (this.touSuFrom.content.length <= 10) {
                this.cententErrMes = '投诉内容字数不能小于10个数'
                return
            }
            API.getOrderTouSu(this.touSuFrom).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.$toast.success(_res.data);
                    this.complaintShow = false
                    this.cententErrMes = ''
                    this.complaintTypeText = '点击选择投诉类型'
                    this.touSuFrom = {content: '',type_id: '1',order_id: '',order_no: ''}
                    
                } else {
                    this.$toast.fail(_res.data)
                }
            })
        },
        handelComplaintTypeShow () {
            this.typeShow = !this.typeShow
        },
        onConfirm (value, index) { //确定选着类型
            this.complaintTypeText = value
            this.typeShow = !this.typeShow
        },
        onCancel () { //取消选着类型
            this.typeShow = !this.typeShow
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .van-card:not(:first-child) {margin-top: 0;}
    .van-card{border-bottom: .5px solid #ededed}
    .footer{padding: 5px 10px;line-height: 10px;background: #fafafa}
    .footer .total-goods-num{margin-bottom: 5px;color: #aaa;}
    .footer .total-goods-num span{color: #f44;}
    .tabs{position: fixed;z-index: 1;top: 0;left: 0;width: 100%;}
    .list{padding-top: 50px;}
    .list-item{margin-bottom: 10px;border-bottom: .5px solid #ededed;}
    .tips{padding-top: 50px;}
    .overlay100vh{height: 100vh;width: 100%;background: #f4f4f4}
    .fixed{position: fixed;bottom: 0;left: 0;width: 100%}
    .return-wrap{padding: 5px 10px;background: #fff;}
    .return{display: inline-block;width: 35px;height: 35px;line-height: 41px;border-radius: 50%;font-size: 25px;background: rgb(40, 169, 255);color: #fff;}
    .complaint-type{padding: 0 15px;line-height: 30px;border-bottom: .5px solid #ededed;font-size: 14px;background: #fff;color: #aaa}
    .complaint-type span{color: #323233}
</style>