<template>
    <div class="wrap">
        <van-row class="tabs-wrap">
            <!-- 左边一级分类 -->
            <van-col span="6" class="tabs-nav text-center">
                <van-row v-for="(item, index) in resultInfo.categoryList" :key="item.id" :class="{'active': index === TypeIndex}"><div @click="getGetTypeInfo(index, item.id)">{{item.name}}</div></van-row>
            </van-col>
            <!-- 右边二三级分类 -->
            <van-col span="18" class="tabs-centent">
                <van-row class="list" v-for="item in resultInfo.currentCategory.subCategoryList" :key="item.id">
                    <van-row>
                        <router-link :to="{path: '/goods', query: {id: item.id}}">
                            <van-col span="17" class="title">{{item.name}}</van-col>
                            <van-col span="7" class="more text-right">查看更多<van-icon name="arrow" /></van-col>
                        </router-link>
                    </van-row>
                    <van-row class="item text-center">
                        <van-col span="8" v-for="items in item.subCategoryList" :key="items.id" class="item-info">
                            <router-link :to="{path: '/goods', query: {id: items.id}}">
                                <span class="img">
                                    <img :src="items.imgUrl" :alt="items.name">
                                </span>
                                <p>{{items.name}}</p>
                            </router-link>
                        </van-col>
                    </van-row>
                </van-row>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'goodsType',
    data () {
        return {
           resultInfo: { // 请求回来的数据
                brandList: [],
                categoryList: [],
                currentCategory: {
                    subCategoryList: {
                        subCategoryList: []
                    }
                }
           },
           TypeIndex: 0, //右边选中下标
           params: { //请求数据传递参数
               id: ''
           }
        }
    },
    components: {
        
    },
    created: function () {
        API.getGoodsTypeInfo().then((data) => { //获取数据
            let _res = data.data
            if (_res.errno === 0) {
                this.resultInfo = _res.data
            }
        })
    },
    mounted: function () {
        
    },
    methods: {
        getInfo () { // 获取分类
            API.getGoodsTypeCurrentInfo(this.params).then((data) => {
                let _res = data.data
                if (_res.errno === 0) {
                    this.resultInfo.currentCategory.subCategoryList = _res.data.currentCategory
                }
            })
        },
        getGetTypeInfo (index, id) { //点击一级分类
            if (this.params.id == id) {
                return
            } else {
                this.TypeIndex = index
                this.params.id = id
                this.getInfo()
            }
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .tabs-wrap{height: 100%}
    .tabs-wrap .tabs-nav{height: 100%;line-height: 40px;font-size: 12px;overflow-y: scroll;color: #444;background: #f4f4f4;}
    .tabs-wrap .tabs-nav .van-row{border-bottom: .5px solid #ededed;}
    .active{background: #fff;color: rgb(40, 169, 255);border-left: 2px solid rgb(40, 169, 255)}
    .tabs-wrap .tabs-centent{float: right;height: 100%;overflow-y: scroll;padding: 10px;background: #fff;}
    .tabs-wrap .tabs-centent .list{padding: 10px 0;}
    .tabs-wrap .tabs-centent .list:first-child{padding-top: 0;}
    .tabs-wrap .tabs-centent .list:last-child{border: none;}
    .tabs-wrap .tabs-centent .list .title{font-size: 14px;}
    .tabs-wrap .tabs-centent .list .more{font-size: 12px;color: #ccc;}
    .tabs-wrap .tabs-centent .list .item{margin-top: 10px;}
    .tabs-wrap .tabs-centent .list .item .item-info{height: 110px;margin-bottom: 10px;padding: 0 5px;}
    .tabs-wrap .tabs-centent .list .item .item-info .img{display: block;width: 100%;height: 100px;}
    .tabs-wrap .tabs-centent .list .item .item-info img{width: 100%;height: 100%;}
    .tabs-wrap .tabs-centent .list .item .item-info p{font-size: 12px;color: #999;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 1;-webkit-box-orient: vertical;text-align: center}
</style>