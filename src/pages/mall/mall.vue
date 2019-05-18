<template>
    <div class="wrap">

        <div class="fixed">
            <!-- 搜索 -->
            <van-search
                v-model="searchVal"
                placeholder="请输入搜索关键词"
                show-action
                @search="handelSearch"
            >
                <div slot="action" @click="handelSearch">搜索</div>
            </van-search>
            <!-- 分类 -->
            <van-tabs v-model="active" color="#28a9ff" @click="handelGetGoodsTypeInfo">
                <van-tab v-for="item in resultInfo.goodsType" :key="item.id" :title="item.name"></van-tab>
            </van-tabs>
        </div>

        <!-- 轮播 -->
        <div class="banner-wrap">
            <van-swipe :autoplay="3000">
                <van-swipe-item v-for="item in resultInfo.banner" :key="item.id">
                    <img :src="item.image_url" alt="item.name">
                </van-swipe-item>
            </van-swipe>
        </div>

        <!-- 商品列表 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="goods-wrap"
            v-if="!goodsListLength"
        >
            <van-row>
                <van-col span="11" v-for="item in resultInfo.goodsList.data" :key="item.id" class="goods-item">
                    <router-link :to="{path:'/goodsDetails',query:{id: item.id}}">
                        <div class="img">
                            <img :src="item.primaryPicUrl" alt="">
                        </div>
                        <van-row class="goods-info">
                            <p class="goods-title" v-html="item.name"></p>
                            <p class="goods-pic">￥{{item.retailPrice}}</p>
                        </van-row>
                    </router-link>
                </van-col>
            </van-row>
        </van-list>
        <div class="tips" v-if="goodsListLength">
            <van-icon name="bag-o" />
            <div class="tips-text">
                此分类无商品 换一个试试吧
            </div>
        </div>
        <!-- 底部导航 -->
        <v-nav></v-nav>
    </div>

</template>

<script>
import API from '@/api/index'
import vNav from '@/components/nav'
export default {
    name: 'mall',
    data () {
        return {
            show: true,
            active: 0,//分类选中下标
            resultInfo: { //请求回来的数据
                goodsType: [],
                banner: [],
                goodsList: {
                    currentNum: null,
                    data: [],
                    totalPage: null,
                }
            },
            params: { //获取数据要传递的参数
                page: 1,
                category_id: '',
                page: 1,
                size: 10
            },
            searchVal: '', //搜索词
            //上拉加载更多
            loading: false,
            finished: true,
        }
    },
    components: {
        vNav
    },
    computed: {
        goodsListLength: function () {
            return this.resultInfo.goodsList.data.length == 0
        }
    },
    created: function () {
        this.getInfo()
        this.getGoodsListInfo(2)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo () { 
            API.getGoodsTypeInfo().then((data) => {  //获取分类数据
                this.resultInfo.goodsType = data.data.data.categoryList
                this.resultInfo.goodsType.splice(0,0,{id: '',name: '全部'})
                this.resultInfo.goodsType.push({id: 'more', name: '更多'}) 
            })
            API.getMallBannerInfo().then((data) => {  //获取banner
                let _res = data.data
                if (_res.errno === 0) {
                    this.resultInfo.banner = _res.data.banner
                }
            })
        },
        getGoodsListInfo (type) {
            API.getGoodsListInfo(this.params).then((data) => { //获取商品列表
                if (type == 1) {
                    if (data.data.data.length != 0) {
                        this.resultInfo.goodsList.data = this.resultInfo.goodsList.data.concat(data.data.data)
                    }
                    this.loading = false
                    if (this.params.page >= data.data.totalPage) {
                        this.finished = true
                    }
                } else {
                    this.resultInfo.goodsList.currentNum = data.data.currentNum
                    this.resultInfo.goodsList.data = data.data.data
                    this.resultInfo.goodsList.totalPage = data.data.totalPage
                    if (data.data.totalPage != 0 || data.data.totalPage != 1) {
                        this.finished = false
                    }
                }
            })
        },
        handelSearch () { //搜索
            this.$router.push({path: '/goods',query: {searchVal: this.searchVal}})
        },
        handelGetGoodsTypeInfo (index, title) { //点击分类获取数据
            if (this.resultInfo.goodsType.length == index+1) {
                this.$router.push({path: 'goodsType'})
            } else {
                this.params.category_id = this.resultInfo.goodsType[index].id
                this.params.page = 1
                this.getGoodsListInfo(2)
            }
        },
        onLoad() {// 上拉加载更多数据
            setTimeout(() => {
                this.params.page++
                this.getGoodsListInfo(1)
            }, 500);
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;overflow: scroll;padding-bottom: 48px;}
    .fixed{position: fixed;z-index: 2;top: 0;left: 0;width: 100%;}
    .banner-wrap{margin-top: 90px;overflow: hidden;background: #fff;}
    .banner-wrap img{width: 100%;height: 100%;}
    /* 商品列表 */
    .goods-wrap{text-align: center;}
    .goods-wrap .goods-item{margin: 5px;background: #fff;box-sizing: border-box;overflow: hidden;}
    .goods-wrap .goods-item .img{width: 100%;height: 160px;overflow: hidden;}
    .goods-wrap .goods-item img{width: 100%;}
    .goods-wrap .goods-item:nth-child(odd){margin-right: 1.6%;margin-left: 2.5%;}
    .goods-wrap .goods-item:nth-child(even){margin-right: 2.5%;margin-left: 1.6%;}
    .goods-wrap .goods-item .goods-info{padding: 10px;}
    .goods-wrap .goods-item .goods-info .goods-title{margin-bottom: 5px;font-size: 16px;color: #505050;line-height: 18px;height: 18px;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;}
    .goods-wrap .goods-item .goods-info .goods-pic{font-size: 14px;color:#b4282d;}
</style>
