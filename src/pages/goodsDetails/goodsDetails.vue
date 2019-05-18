<template>
    <div class="wrap">
        <!-- <div class="return text-center" @click="$router.go(-1)">
            <van-icon name="arrow-left" />
        </div> -->
        <div class="top">
            <!-- 商品图片 -->
            <div class="banner-wrap">
                <van-swipe>
                    <van-swipe-item v-for="item in resultInfo.gallery" :key="item.id">
                        <img :src="item.img_url" :alt="item.img_desc" @click="handelSwipeEnlarge(1)">
                    </van-swipe-item>
                </van-swipe>
            </div>
            <!-- 商品信息 -->
            <div class="goods-info">
                <van-row type="flex" justify="space-around" class="promise">
                    <van-col span="6">30天无忧退货</van-col>
                    <van-col span="7">48小时快速退款</van-col>
                    <van-col span="6">满88免邮费</van-col>
                </van-row>
                <van-row class="text-left">
                    <van-col class="goods-pic text-left" span="24">￥{{resultInfo.info.retailPrice}}</van-col>
                    <van-col class="goods-describe text-left" span="24">￥{{resultInfo.info.marketPrice}}</van-col>
                    <van-col class="goods-title text-left" span="24">{{resultInfo.info.name}}</van-col>
                </van-row>
            </div>
            <!-- 选中规格 -->
            <div class="sku">
                <van-row>
                    <div @click="handelSku">
                        <van-col span="12" class="text-left">
                            已选中：{{selectionSku.goods_specification_name}}
                        </van-col>
                        <van-col span="12" class="text-right">
                            <van-icon name="arrow" />
                        </van-col>
                    </div>
                </van-row>
            </div>
            <!-- 商品详情/评论 -->
            <div class="goods-comment">
                <van-tabs v-model="active" swipeable animated color="rgb(40, 169, 255)">
                    <van-tab title="商品详情">
                        <div class="details" v-show="active == 0">
                            <img :src="resultInfo.info.listPicUrl" alt="">
                        </div>
                    </van-tab>
                    <van-tab :title="'评论('+resultInfo.comment.count+')'">
                        <div class="comment-list" v-show="active == 1" v-if="resultInfo.comment.count != 0">
                            <div class="list-item" v-for="(item, index) in resultInfo.comment.comment" :key="item.id">
                                <van-row class="user-info">
                                    <van-col span="3" class="user-avatar">
                                        <span>
                                        <img :src="item.avatar" alt="">
                                        </span>
                                    </van-col>
                                    <van-col span="21">
                                        <p class="user-name">{{item.nickname}}</p>
                                        <p class="time">{{item.add_time}}</p>
                                    </van-col>
                                </van-row>
                                <van-row class="comment-info">
                                    <van-col span="24" class="comment-info-centent">
                                        {{item.content}}
                                    </van-col>
                                    <van-col span="24" class="comment-info-img">
                                        <img v-for="(items, indexx) in item.pic_list" :src="items.pic_url" @click="handelSwipeEnlarge(3,' ', index)" :key="indexx" :alt="index">
                                    </van-col>
                                </van-row>
                            </div>
                        </div>
                        <div class="tips" v-if="resultInfo.comment.count == 0">
                            <van-icon name="records" />
                            <div class="tips-text">
                                该商品暂无评论
                            </div>
                        </div>
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <!-- bottom -->
        <van-goods-action>
            <van-goods-action-mini-btn
                :icon="collection.icon"
                :text="collection.text"
                @click="handelCollection"
            />
                <!-- :info="resultInfo.userHasCollect" -->
            <van-goods-action-mini-btn
                icon="cart-o"
                text="购物车"
                to="/cart"
            />
            <van-goods-action-big-btn
                text="加入购物车"
                @click="handelSku(1)"
            />
            <van-goods-action-big-btn
                primary
                text="立即购买"
                @click="handelSku(2)"
            />
        </van-goods-action>
        <!-- 规格 -->
        <van-popup v-model="skuShow" position="bottom">
            <div class="sku-wrap">
                <van-row class="bor">
                    <van-col class="sku-img" span="8">
                        <img :src="selectionSku.pic_url" alt="" @click="handelSwipeEnlarge(2, selectionSku.pic_url)">
                    </van-col>
                    <van-col span="14" class="sku-info">
                        <p class="title">{{resultInfo.info.name}}</p>
                        <p class="pic">￥{{selectionSku.retail_price}}</p>
                    </van-col>
                    <van-col span="2">
                        <van-icon @click="handelSku(3)" name="close" class="sku-close"/>
                    </van-col>
                </van-row>
                <van-row class="bor">
                    规格:
                    <van-row class="list-wrap">
                        <span
                            class="sku-item"
                            :class="{'active': index === skuIndex}"
                            v-for="(item, index) in resultInfo.productList" 
                            :key="item.id"
                            @click="handelSelectionSku(item, index)"
                        >
                            {{item.goods_specification_name}}
                        </span>
                    </van-row>
                </van-row>
                <van-row class="bor">
                    <van-col span="12" class="num-text">
                        数量：
                    </van-col>
                    <van-col span="12" class="text-right">
                        <van-stepper
                            v-model="num"
                            integer
                            :min="1"
                            :max="selectionSku.goods_number"
                        />
                    </van-col>
                    <van-col span="24" class="surplus">
                        剩余存库：{{selectionSku.goods_number}}
                    </van-col>
                </van-row>
            </div>
        </van-popup>
    </div>
</template>

<script>
import { ImagePreview } from 'vant'
import API from '@/api/index'
export default {
    name: 'goodsDetails',
    data () {
        return {
            skuShow: false,  //详情评论切换下标
            resultInfo: {   //请求回来的数据
                attribute: [],
                brand: {},
                comment: {
                    comment: [],
                    count: 0,
                },
                gallery: [],
                info: {},
                issue: [],
                productList: [],
                specificationList: [],
                userHasCollect: null,
            },
            // resultSkuInfo: {
            //     productList: {}
            // },
            ImagePreviewList: [

            ],
            active: 0,
            collection: {
                icon: 'like-o',
                text: '收藏',
            },
            num: 1,
            params: {
                id: null
            },
            selectionSku: {

            },
            skuIndex: 0,
            collectionIconColor: ''
        }
    },
    components: {
        ImagePreview
    },
    created: function () {
        //获取跳转页面带过来的参数
        this.params.id = this.$route.query.id
        this.getInfo()
    },
    mounted: function () {
        window.addEventListener('scroll', this.handleScroll)
        // console.log(document.querySelectorAll('.van-goods-action-mini-btn')[0])
    },
    methods: {
        getInfo () { //获取数据
            API.getGoodsDetailsInfo(this.params).then((data) => {
                let _res = data.data
                if (_res.errno === 0) {
                    this.resultInfo = _res.data
                    this.selectionSku = this.resultInfo.productList[0]
                    this.resultInfo.gallery.map(item => {
                        this.ImagePreviewList.push(item.img_url)
                    })
                    if (_res.data.userHasCollect == 1) {
                        this.collection.icon = 'like'
                        this.collection.text = '已收藏'
                        document.querySelectorAll('.van-goods-action-mini-btn')[0].style.color = '#f44'
                    }
                }
            })
        },
        handleScroll () { //设定
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop //获取滚动条位置
            let offsetTop = document.querySelector('.goods-comment').offsetTop //获取元素top位置
            if (scrollTop > offsetTop) {
                let oNav = document.querySelector('.van-tabs__wrap.van-hairline--top-bottom')
                oNav.style.position = 'fixed'
                oNav.style.left = '0'
                oNav.style.top = '0'
            } else {
                let oNav = document.querySelector('.van-tabs__wrap.van-hairline--top-bottom')
                oNav.style.position = ''
                oNav.style.left = '0'
                oNav.style.top = '0'
            }
        },
        getSkuInfo () { //获取规格
            // let params = {goods_id: this.params.id}
            // API.getgoodsSku(params).then((data) => {
            //     // resultSkuInfo
            //     const _res = data.data.data
            //     this.resultSkuInfo = _res
            // })
        },
        handelSwipeEnlarge (type, goodsImg, $index) {
            if (type == 1) {
                ImagePreview(
                    this.ImagePreviewList,
                );
            } else if (type == 2) { //规格图片
                let arr = [goodsImg]
                ImagePreview(
                    arr
                );
            } else { //评论图片
                let arr = []
                this.resultInfo.comment.comment[$index].pic_list.map(item => {
                    arr.push(item.pic_url)
                })
                ImagePreview(
                    arr
                );
            }
        },
        handelCollection () { //收藏
            let params = {valueId: this.params.id}
            API.getCollection(params).then((data) => {
                const _res = data.data.data.type
                if (_res == '收藏成功') {
                    this.collection.icon = 'like'
                    this.collection.text = '已收藏'
                    document.querySelectorAll('.van-goods-action-mini-btn')[0].style.color = '#f44'
                } else if (_res == '取消收藏') {
                    this.collection.icon = 'like-o'
                    this.collection.text = '收藏'
                    document.querySelectorAll('.van-goods-action-mini-btn')[0].style.color = '#7d7e80'
                }
            })
        },
        handelSku (type) { // 1为加入购物车 2为直接购买 3为关闭
            if (this.skuShow) {
                let params = {productId: this.selectionSku.id, number: this.num}
                if (type == 1) {
                    API.getCartAdd(params).then((data) => {
                        if (data.data.errno === 0) {
                            this.$toast.success(data.data.errmsg)
                            this.skuShow = false
                        }
                    })
                } else if (type == 2) {
                    this.$router.push({path:'/checkout', query:{type: 'buy', productId: this.selectionSku.id, number: this.num}})
                } else {
                    this.skuShow = false
                }
            } else {
                this.skuShow = !this.skuShow
            }
        },
        handelSelectionSku (item, $index) { // 选中规格
            this.selectionSku = item
            this.skuIndex = $index
        }
    },
    destroyed () { //移除滚动条事件
        window.removeEventListener('scroll', this.handleScroll)
    },
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .return{position: fixed;z-index: 2000;left: 15px;top: 15px;width: 40px;height: 40px;line-height: 45px;border-radius: 50%;font-size: 25px;background: rgb(40, 169, 255);color: #fff;}
    .top{margin-bottom: 20px;}
    .banner-wrap{height: 400px;overflow: hidden;background: #fff;}
    .banner-wrap img{width: 100%;height: 100%;}
    /* 商品信息 */
    .goods-info{border-bottom: .5px solid #ededed;padding-bottom: 5px;background: #fff;}
    .goods-info .promise{line-height: 25px;text-align: center;background: #f4f4f4;font-size: 12px;}
    .goods-info .goods-title{line-height: 30px;text-align: center;font-size: 18px;padding-left: 10px;padding-right: 10px;}
    .goods-info .goods-pic{color: #b4282d;text-align: center;font-size: 20px;line-height: 20px;margin-top: 5px;padding-left: 10px;}
    .goods-info .goods-describe{text-align: center;font-size: 14px;color: #7d7e80;text-decoration: line-through;padding-left: 10px;line-height: 20px;}
    /* 选着规格 */
    .sku{padding: 0 10px;line-height: 45px;background: #fff;}
    /* 详情评论 */
    .goods-comment{background: #fff;}
    .goods-comment .details{padding: 10px;}
    .goods-comment .details img{width: 100%;}
    .goods-comment .comment{padding: 10px;}
    /* 评论 */
    .comment .comment-list{}
    .comment-list .list-item{padding: 10px 0;border-bottom: .5px solid #ededed}
    .comment-list .list-item:last-child{margin-bottom: 50px;}
    .comment-list .list-item .user-info{padding-left: 10px;}
    .list-item .user-info .user-avatar span{display: block;border-radius: 50%;overflow: hidden;}
    .list-item .user-info .user-avatar img{width: 100%;}
    .list-item .user-info .user-name{padding-left: 10px;line-height: 30px;}
    .list-item .user-info .time{padding-left: 10px;line-height: 15px;font-size: 12px;color: #7d7e80;}
    .list-item .comment-info{margin-top: 10px;padding-left: 16%}
    .list-item .comment-info {}
    .list-item .comment-info .comment-info-centent{margin-bottom: 10px;padding-right: 10px;line-height: 20px;font-size: 14px;}
    .list-item .comment-info .comment-info-img{}
    .list-item .comment-info .comment-info-img img{width: 50%;}

    /* buttom */
    .van-goods-action{z-index: 9999;}
    /* 規格 */
    .van-popup{overflow: initial}
    .bor{border-bottom: .5px solid #ededed;margin-bottom: 10px;}
    .sku-wrap{padding: 0 15px 60px 15px;background: #fff;}
    .sku-wrap .sku-img{position: relative;top: -10px;background: #fff;}
    .sku-wrap .sku-info .title{padding: 10px;color:#323233;}
    .sku-wrap .sku-info .pic{padding-left: 10px;color: #f44;}
    .sku-close{font-size: 20px;margin-top: 10px;}
    .list-wrap{margin-top: 10px;}
    .sku-item{display: inline-block;padding: 5px 9px;margin: 0 10px 10px 0;height: 28px;min-width: 52px;line-height: 16px;font-size: 12px;color: #323233;text-align: center;border: 1px solid #969799;border-radius: 3px;box-sizing: border-box;}
    .num-text{line-height: 25px;font-size: 16px;}
    .surplus{margin-bottom: 10px;}
    .active{color: #fff;border-color: #f44;background: #f44;}
    .tips{margin-bottom: 50px;}
</style>

