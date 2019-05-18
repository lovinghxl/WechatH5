<template>
    <div class="wrap">
        <div class="top">
            <!-- 用户信息 -->
            <div class="user-info">
                <van-row class="text-center">
                    <van-col span="24" class="user-avatar">
                        <img :src="userInfo.avatar" alt="">
                    </van-col>
                    <van-col span="24" class="user-name">
                        {{userInfo.nickname}}
                    </van-col>
                </van-row>
                <van-row class="text-center">
                    <van-col span="12" class="user-gold-wrap">
                        <van-row class="gold-title">
                            金币
                        </van-row>
                        <van-row class="gold">
                            {{userInfo.coin}}
                        </van-row>
                    </van-col>
                    <van-col span="12" class="user-integral-wrap">
                        <van-row class="integral-title">
                            积分
                        </van-row>
                        <van-row class="integral">
                            {{userInfo.balance}}
                        </van-row>
                    </van-col>
                </van-row>
            </div>
            <!-- 订单 -->
            <div class="order-wrap">
                <van-row class="order-whole">
                    <div @click="handelRouter(-1)">
                        <van-col span="22">我的订单</van-col>
                        <van-col span="2" class="text-right">
                            <van-icon name="arrow" />
                        </van-col>
                    </div>
                </van-row>
                <van-row class="order-list" type="flex" justify="space-around">
                    <van-col class="order-list-item text-center" v-for="(item, index) in orderList" :key="index">
                        <div @click="handelRouter(index)">
                            <van-row>
                                <van-icon :name="item.icon" />
                            </van-row>
                            <van-row class="title">{{item.title}}</van-row>
                        </div>
                    </van-col>
                </van-row>
            </div>
            <!-- 其它 -->
            <div class="other-wrap">
                <van-row class="other-title">
                    服务/其它
                </van-row>
                <van-row class="other-list text-center">
                    <van-col span="6" class="other-list-item">
                        <router-link tag="div" to="/footprint">
                            <van-row>
                                <van-icon name="clock-o" />
                            </van-row>
                            <van-row class="item-title">
                                我的足迹
                            </van-row>
                        </router-link>
                    </van-col>
                    <van-col span="6" class="other-list-item">
                        <router-link tag="div" to="/collection">
                            <van-row>
                                <van-icon name="like-o" />
                            </van-row>
                            <van-row class="item-title">
                                收藏
                            </van-row>
                        </router-link>
                    </van-col>
                    <van-col span="6" class="other-list-item">
                        <router-link tag="div" to="/address">
                            <van-row>
                                <van-icon name="location-o" />
                            </van-row>
                            <van-row class="item-title">
                                收货地址
                            </van-row>
                        </router-link>
                    </van-col>
                    <van-col span="6" class="other-list-item">
                        <router-link tag="div" to="/cart">
                            <van-row>
                                <van-icon name="shopping-cart-o" />
                            </van-row>
                            <van-row class="item-title">
                                购物车
                            </van-row>
                        </router-link>
                    </van-col>
                    <van-col span="6" class="other-list-item">
                        <router-link to="/feedback" tag="div">
                            <van-row>
                                <van-icon name="records" />
                            </van-row>
                            <van-row class="item-title">
                                意见反馈
                            </van-row>
                        </router-link>
                    </van-col>
                    <van-col span="6" class="other-list-item">
                        <router-link to="/complaintList" tag="div">
                            <van-row>
                                <van-icon name="edit" />
                            </van-row>
                            <van-row class="item-title">
                                投诉列表
                            </van-row>
                        </router-link>
                    </van-col>
                    <van-col span="6" class="other-list-item">
                        <router-link to="/repair" tag="div">
                            <van-row>
                                <van-icon name="edit" />
                            </van-row>
                            <van-row class="item-title">
                                报修
                            </van-row>
                        </router-link>
                    </van-col>
                    <!-- <van-col span="6" class="other-list-item">
                        <router-link tag="div" to="/api">
                            <van-row>
                                <van-icon name="location-o" />
                            </van-row>
                            <van-row class="item-title">
                                测试接口
                            </van-row>
                        </router-link>
                    </van-col> -->
                </van-row>
            </div>
        </div>
        <!-- 底部导航 -->
        <v-nav></v-nav>
    </div>
</template>

<script>
import vNav from '@/components/nav'
export default {
    name: 'index',
    data () {
        return {
            orderList: [ //tabs列表
                {title: '待付款', icon: 'balance-pay'},
                {title: '待发货', icon: 'bag-o'},
                {title: '待收货', icon: 'logistics'},
                {title: '待评价', icon: 'records'},
                {title: '退换/售后', icon: 'peer-pay'}
            ],
            userInfo: {} //请求回来的数据
        }
    },
    components: {
        vNav
    },
    created: function () {
        if (!!$cookies.get('USER_INFO')) { //获取cookies数据
            this.userInfo = $cookies.get('USER_INFO')
        }
    },
    mounted: function () {
        
    },
    methods: {
        handelRouter ($index) { //订单跳转页面
            if ($index == 3) {
                this.$router.push({path: '/stayEvaluate'})
            } else {
                this.$router.push({path: '/order', query:{index: $index+1}})
            }
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .top{margin-bottom: 50px;}
    /* 用户信息 */
    .user-info{padding-top: 30px;color: #fff;background: url('../../../assets/img/userinfo-bg-3.jpg');background-size: 100%;}
    /* .user-info .user-avatar{} */
    .user-info .user-avatar img{width: 80px;height: 80px;border-radius: 50%;}
    .user-info .user-name{margin-bottom: 10px;line-height: 30px;font-size: 16px;font-weight: bold;}
    .user-gold-wrap, .user-integral-wrap{padding: 5px 0;line-height: 20px;background: #9ed8ff}
    .gold-title, .integral-title{font-size: 16px;font-weight: bold;color: #e9f6ff;}
    .gold, .integral{font-size: 14px;color: #e9f6ff}
    /* 订单 */
    /* .order-wrap{} */
    .order-wrap .order-whole{padding: 0 10px;line-height: 50px;background: #fff;border-bottom: .5px solid #ededed;}
    .order-wrap .order-list{line-height: 16px;padding: 10px 0;background: #fff;}
    .order-wrap .order-list .order-list-item{color: #333}
    .order-wrap .order-list .order-list-item .van-icon{font-size: 25px}
    /* .order-wrap .order-list .order-list-item .title{} */
    /* 其它 */
    .other-wrap{margin-top: 10px;background: #fff;}
    .other-wrap .other-title{padding: 0 10px;line-height: 50px;border-bottom: .5px solid #ededed;}
    /* .other-wrap .other-list{} */
    .other-wrap .other-list .other-list-item{line-height: 20px;padding: 15px 0;color: #333;border-bottom: .5px solid #ededed;}
    .other-wrap .other-list .other-list-item .van-icon{font-size: 22px;}
</style>