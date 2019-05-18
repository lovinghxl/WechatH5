<template>
    <div class="wrap">
        <div class="fixed">
            <!-- 搜索 -->
            <van-search
                v-model="params.name"
                placeholder="请输入搜索关键词"
                show-action
                @search="handelSearch"
            >
                <div slot="action" @click="handelSearch">搜索</div>
            </van-search>
            <van-row type="flex" justify="space-around" class="sort-btn text-center">
                <van-col span="4" v-for="(item, index) in sortBtnList" :key="item.name" class="icon-pos">
                    <div :class="{'bor': index == 4,'active': index == btnIndex}" @click="handelGetSort(index)">
                        {{item.name}}
                        <van-icon v-if="index == 3" :class="{'active': params.order == 'desc'}" name="arrow-up" class="icon-up" />
                        <van-icon v-if="index == 3" :class="{'active': params.order == 'asc'}" name="arrow-down" class="icon-down" />
                    </div>
                </van-col>
            </van-row>
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
                <van-col v-for="item in resultInfo.data" :key="item.id" span="11" class="goods-item">
                    <router-link :to="{path: '/goodsDetails', query: {id: item.id}}">
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
                你搜索的关键词/筛选没有存在对应商品
            </div>
        </div>
        <van-popup @open="open" @click-overlay="handelCompleteScreening" class="wcreen-wrap" v-model="screenShow" position="right">
            <div class="filter-wrap">
                <div class="item">
                    <van-row>
                        <!-- 品牌 -->
                        <van-col span="24" class="item" v-show="!brandListLength">
                            <van-row class="header">
                                <van-col span="12" class="title">品牌</van-col>
                                <van-col span="12" class="text-right">
                                    <span class="more" v-if="resultInfo.brand.length > 6" @click="handelMoreBrand">
                                        更多
                                        <van-icon name="arrow-down" />
                                    </span>
                                </van-col>
                            </van-row>
                            <van-row class="text-center centent">
                                <van-col span="7" v-for="(item, index) in resultInfo.brand" v-show="brandLengthShow >= index+1" :key="item.id" class="sku-item" :class="{'active': params.brand_id.indexOf(item.id) >= 0}">
                                    <div @click="handelBrandId(item.id)">
                                        {{item.name}}
                                    </div>
                                </van-col>
                            </van-row>
                        </van-col>
                        <van-col span="24" class="item" v-show="!categoryListLength">
                            <van-row class="header">
                                <van-col span="12" class="title">分类</van-col>
                                <van-col span="12" class="text-right">
                                    <span class="more" v-if="resultInfo.category.length > 6" @click="handelMoreCategory">
                                        更多
                                        <van-icon name="arrow-down" />
                                    </span>
                                </van-col>
                            </van-row>
                            <van-row class="text-center centent">
                                <van-col span="7" v-for="(item, index) in resultInfo.category" v-show="categoryLengthShow >= index+1" :key="item.id" class="sku-item" :class="{'active': params.category_id.indexOf(item.id) >= 0}">
                                    <div @click="handelCategoryId(item.id)">
                                        {{item.name}}
                                    </div>
                                </van-col>
                            </van-row>
                        </van-col>
                    </van-row>
                </div>
                <van-row class="bottom-btn">
                    <van-col span="10">
                        <van-button size="large" type="default" @click="handelEmptyScreening">清空</van-button>
                    </van-col>
                    <van-col span="14">
                        <van-button size="large" @click="handelCompleteScreening" type="danger">完成</van-button>
                    </van-col>
                </van-row>
            </div>
        </van-popup>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'goods',
    data () {
        return {
            sortBtnList: [
                {name: '综合', type: 'colligate'},
                {name: '销量', type: 'salesVolume'},
                {name: '上新', type: 'new'},
                {name: '价格', type: 'price'},
                {name: '筛选'}
            ],
            resultInfo: {
                brand: [],//品牌
                category: [],//分类
                currentNum: null,//页数量
                data: [],//商品
                total: null,//总条数
                totalPage: null//总页数
            },
            brandLengthShow: 6,
            categoryLengthShow: 6,
            params: {
                page: 1, //请求当前页数
                name: '',//当前搜索值
                category_id: [],//分类(多个分类用,隔开)
                brand_id: [],//品牌(多个品牌用,隔开)
                is_new: '', //是否新商品(0不是 ，1是 )
                market_price: '',//价格区间(0-1000)
                order: '',//排序规则(desc表示降序 asc表示升序)
                sort: '',//排序字段(retail_price(价格)/sell_volume(销量)表示按照真实价格排序)zzzzzzzzzz
            },
            //上拉加载更多
            loading: false,
            finished: true,
            // 筛选
            screenShow: false,
            // 排序按钮
            btnIndex: 0,
        }
    },
    components: {
        
    },
    computed: {
        goodsListLength: function () {
            return this.resultInfo.data.length == 0
        },
        brandListLength: function () {
            return this.resultInfo.brand.length == 0
        },
        categoryListLength: function () {
            return this.resultInfo.category.length == 0
        }
    },
    created: function () {
        // 获取页面跳转带过来的参数
        this.params.name = this.$route.query.searchVal ? this.$route.query.searchVal : ''
        if (this.$route.query.id) {
            this.params.category_id.push(this.$route.query.id ? this.$route.query.id : '')
        }
        this.getInfo(2)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo (type) { //获取商品列表
            let params = {
                page: this.params.page, //请求当前页数
                name: this.params.name,//当前搜索值
                category_id: '',//分类(多个分类用,隔开)
                brand_id: '',//品牌(多个品牌用,隔开)
                is_new: this.params.is_new, //是否新商品(0不是 ，1是 )
                market_price: this.params.market_price,//价格区间(0-1000)
                order: this.params.order,//排序规则(desc表示降序 asc表示升序)
                sort: this.params.sort,//排序字段(retail_price(价格)/sell_volume(销量)表示按照真实价格排序)zzzzzzzzzz
            }
            this.params.category_id.map(item => {
                params.category_id += item + ','
            })
            this.params.brand_id.map(item => {
                params.brand_id += item + ','
            })
            API.getGoodsListInfo(params).then((data) => {
                if (type == 1) {
                    if (data.data.data != 0) {
                        this.resultInfo.data = this.resultInfo.data.concat(data.data.data)
                    }
                    this.loading = false
                    if (this.params.page >= data.data.totalPage) {
                        this.finished = true
                    }
                } else {
                    this.resultInfo = data.data
                    this.finished = false
                }
            })
        },
        handelCategoryId (categoryId) { //筛选选中取消分类
            let idIndex = this.params.category_id.indexOf(categoryId)
            if (idIndex >= 0) {
                this.params.category_id.splice(idIndex, 1)
            } else {
                this.params.category_id.push(categoryId)
            }
            console.log(this.params.category_id)
        },
        handelBrandId (brandId) {//筛选选中取消品牌
            let idIndex = this.params.brand_id.indexOf(brandId)
            if (idIndex >= 0) {
                this.params.brand_id.splice(idIndex, 1)
            } else {
                this.params.brand_id.push(brandId)
            }
        },
        handelMoreBrand () { //展开更多品牌
            this.brandLengthShow = this.resultInfo.brand.length
        },
        handelMoreCategory () { //展开更多分类
            this.categoryLengthShow = this.resultInfo.category.length
        },
        handelEmptyScreening () { //清空筛选
            this.params.brand_id = []
            this.params.category_id = []
        },
        handelCompleteScreening () { //完成筛选
            // if (this.params.category_id.length == 0 || this.params.brand_id.length == 0) {
            //     return
            // }
            this.params.page = 1
            this.getInfo(2)
            this.screenShow = !this.screenShow
        },
        handelSearch () { //搜索
            this.params.page = 1
            this.getInfo(2)
            this.$router.push({path: '/goods',query: {searchVal: this.params.name}})
        },
        handelGetSort ($index) { //排序按钮
            if ($index != 4) {
                this.resultInfo =  {
                    brand: [],//品牌
                    category: [],//分类
                    currentNum: null,//页数量
                    data: [],//商品
                    total: null,//总条数
                    totalPage: null,//总页数
                    category_id: [],//分类(多个分类用,隔开)
                    brand_id: [],//品牌(多个品牌用,隔开)
                }
            }
            this.btnIndex = $index != 4 ? $index : this.btnIndex
            if ($index == 0) {
                this.params = {
                    page: 1, //请求当前页数
                    name: this.params.name,
                    category_id: [],//分类(多个分类用,隔开)
                    brand_id: [],//品牌(多个品牌用,隔开)
                    is_new: '', //是否新商品(0不是 ，1是 )
                    market_price: '',//价格区间(0-1000)
                    order: 'desc',//排序规则(desc表示降序 asc表示升序)
                    sort: 'retail_price',//排序字段(retail_price(价格)/sell_volume(销量)表示按照真实价格排序)zzzzzzzzzz
                }
                this.getInfo()
            }
            if ($index == 1) {
                this.params = {
                    page: 1, //请求当前页数
                    name: this.params.name,
                    category_id: [],//分类(多个分类用,隔开)
                    brand_id: [],//品牌(多个品牌用,隔开)
                    is_new: '', //是否新商品(0不是 ，1是 )
                    market_price: '',//价格区间(0-1000)
                    order: 'desc',//排序规则(desc表示降序 asc表示升序)
                    sort: 'sell_volume',//排序字段(retail_price(价格)/sell_volume(销量)表示按照真实价格排序)zzzzzzzzzz
                }
                this.getInfo()
            }
            if ($index == 2) {
                this.params = {
                    page: 1, //请求当前页数
                    name: this.params.name,
                    category_id: [],//分类(多个分类用,隔开)
                    brand_id: [],//品牌(多个品牌用,隔开)
                    is_new: 1, //是否新商品(0不是 ，1是 )
                    market_price: '',//价格区间(0-1000)
                    order: 'desc',//排序规则(desc表示降序 asc表示升序)
                    sort: 'retail_price',//排序字段(retail_price(价格)/sell_volume(销量)表示按照真实价格排序)zzzzzzzzzz
                }
                this.getInfo()
            }
            if ($index == 3) {
                let order = this.params.order == 'desc' ? 'asc' : 'desc' 
                this.params = {
                    page: 1, //请求当前页数
                    name: this.params.name,
                    category_id: [],//分类(多个分类用,隔开)
                    brand_id: [],//品牌(多个品牌用,隔开)
                    is_new: 1, //是否新商品(0不是 ，1是 )
                    market_price: '',//价格区间(0-1000)
                    order: order,//排序规则(desc表示降序 asc表示升序)
                    sort: 'retail_price',//排序字段(retail_price(价格)/sell_volume(销量)表示按照真实价格排序)zzzzzzzzzz
                }
                this.getInfo()
            }
            if ($index == 4) {
                this.screenShow = !this.screenShow
            }
        },
        onLoad() {// 上拉加载更多数据
            setTimeout(() => {
                this.params.page++
                this.getInfo(1)
            }, 500);
        },
        open () {
            console.log(1)
        }
    }
}
</script>
<style scoped>
    .wrap{width: 100%;height: 100%;background: #f4f4f4;overflow: scroll;}
    .fixed{position: fixed;z-index: 2;top: 0;left: 0;width: 100%;}
    /* 排序 */
    .sort-btn{color: #666;line-height: 30px;border-top: .5px solid #ededed;background: #fff;}
    .bor{border-left: .5px solid #ededed}
    /* 商品列表 */
    .goods-wrap{text-align: center;padding-top: 80px;}
    .goods-wrap .goods-item{margin: 5px;background: #fff;box-sizing: border-box;}
    .goods-wrap .goods-item .img{width: 100%;height: 160px;overflow: hidden;}
    .goods-wrap .goods-item img{width: 100%;}
    .goods-wrap .goods-item:nth-child(odd){margin-right: 1.6%;margin-left: 2.5%;}
    .goods-wrap .goods-item:nth-child(even){margin-right: 2.5%;margin-left: 1.6%;}
    .goods-wrap .goods-item .goods-info{padding: 10px;}
    .goods-wrap .goods-item .goods-info .goods-title{margin-bottom: 5px;font-size: 16px;color: #505050}
    .goods-wrap .goods-item .goods-info .goods-pic{font-size: 14px;color:#b4282d;}
    .tips{margin-top: 70px;}
    /* 筛选/弹出 */
    .wcreen-wrap{width: 90%;height: 100vh;}
    .icon-pos{position: relative;}
    .icon-up, .icon-down{position: absolute;right: 1px;font-size: 12px;color: #666;}
    .icon-up{top: 5px;}
    .icon-down{bottom: 5px;}
    .active{color: #000}
    .filter-wrap{height: 100%;overflow-y: scroll;padding: 10px 10px;}
    .filter-wrap .item:last-child{margin-bottom: 50px;}
    .filter-wrap .header{line-height: 30px;}
    .filter-wrap .header .title{font-size: 14px;}
    .filter-wrap .header .more{font-size: 12px;color: #666}
    .filter-wrap .centent .sku-item{display: inline-block;padding: 5px 9px;margin: 0 10px 10px 0;height: 28px;min-width: 52px;line-height: 16px;font-size: 12px;text-align: center;background: #f4f4f4;border-radius: 3px;box-sizing: border-box;}
    .filter-wrap .centent .sku-item.active{background: #fff;border: .5px solid #f44;color: #f44;}
    .filter-wrap .bottom-btn{position: absolute;left: 0;right: 0;bottom: 0;box-shadow: -2px 0px 10px rgba(0,0,0,.2);}
</style>



















