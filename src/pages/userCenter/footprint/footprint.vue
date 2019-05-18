<template>
    <div class="wrap">
        <!-- 商品列表 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            class="goods-wrap"
        >
            <van-row class="list-wrap" v-for="(item, index) in resultInfo.data" :key="index">
                <van-row class="date">
                    {{item.addTime}}
                </van-row>
                <van-row class="list">
                    <van-col span="8" class="list-item" v-for="(item, indexx) in item.list" :key="indexx">
                        <router-link class="img" :to="{path: '/goodsDetails', query: {id: item.goods_id}}" tag="div">
                            <img :src="item.primary_pic_url" :alt="item.name">
                        </router-link>
                        <div class="item-info">
                            <van-col span="12" class="prc">￥{{item.retail_price}}</van-col>
                            <van-col span="12" class="text-right">
                                <van-icon name="ellipsis" @click="handelOperationShow(index, item.id, indexx)" class="fla-right" />
                            </van-col>
                        </div>
                    </van-col>
                </van-row>
            </van-row>
        </van-list>
        <van-popup v-model="operationShow" position="bottom">
            <div class="text-center">
                <van-row class="btn-list">
                    <van-col span="12">
                        <div class="item"><van-icon name="like-o" /></div>
                    </van-col>
                    <van-col span="12">
                        <div class="item" @click="handelDeleteGoods"><van-icon name="delete" /></div>
                    </van-col>
                    <van-col span="12" class="text">
                        收藏
                    </van-col>
                    <van-col span="12" class="text">
                        删除
                    </van-col>
                </van-row>
            </div>
        </van-popup>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'footprint',
    data () {
        return {
            operationShow: false,
            resultInfo: {
                currentPage: '',
                currentPageNum: '',
                data: {},
                numsPerPage: '',
                total: '',
            },
            //上拉加载更多
            loading: false,
            finished: true,
            params: {
                page: 1
            },
            delGoods: {
                footprintId: '',
                index: '',
                indexx: '',
            }
        }
    },
    components: {
        
    },
    created: function () {
        this.getInfo(1)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo (type) {
            API.getFootprintList(this.params).then((data) => {
                const _res = data.data
                if (type == 1) {
                    this.resultInfo = _res
                    this.finished = false
                } else {
                    // if (_res.data.list != 0) {
                    //     // for (let i=0;i<this.resultInfo.data.length;i++) {
                    //     //     for (let j=0;j<_res.data.length;j++) {
                    //     //         if (this.resultInfo.data[i].addTime == _res.data[j].addTime) {
                    //     //             this.resultInfo.data[i].list = this.resultInfo.data[i].list.concat(_res.data[j].list)
                    //     //         } else {
                    //     //             this.resultInfo.data = this.resultInfo.data.concat(_res.data)
                    //     //         }
                    //     //     }
                    //     // }
                    // }
                    for (let i=0;i<_res.data.length;i++) {
                        if (_res.data[i].addTime == this.resultInfo.data[this.resultInfo.data.length-1].addTime) {
                            this.resultInfo.data[this.resultInfo.data.length-1].list = this.resultInfo.data[this.resultInfo.data.length-1].list.concat(_res.data[i].list)
                        } else {
                            this.resultInfo.data = this.resultInfo.data.concat(_res.data[i])
                        }
                    } 
                    this.loading = false
                    if (this.params.page >= _res.totalNum) {
                        this.finished = true
                    }
                }
            })
        },
        handelOperationShow ($index, goodsId, $indexx) {
            this.delGoods.index = $index
            this.delGoods.indexx = $indexx
            this.delGoods.footprintId = goodsId
            this.operationShow = !this.operationShow
        },
        handelDeleteGoods () { //单个删除商品
            API.getFootprintDelete({footprintId: this.delGoods.footprintId}).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.$toast.success(_res.errmsg);
                    this.resultInfo.data[this.delGoods.index].list.splice(this.delGoods.indexx, 1)
                    if (this.resultInfo.data[this.delGoods.index].list == 0) {
                        this.resultInfo.data.splice(this.delGoods.index, 1)
                    }
                    this.delGoods = {footprintId: '', index: '', indexx: '',}
                    this.operationShow = !this.operationShow
                }
            })
        },
        onLoad() {// 上拉加载更多数据
            setTimeout(() => {
                this.params.page++
                this.getInfo(2)
            }, 500);
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;overflow-x: scroll;}
    /* .list-wrap{} */
    .list-wrap .date{padding-left: 10px;color: #666;line-height: 20px;}
    /* .list-wrap .list{} */
    .list-wrap .list .list-item{background: #fff;}
    .list-wrap .list .list-item .img{height: 100px;overflow: hidden;}
    .list-wrap .list .list-item .item-info{padding: 0 5px;line-height: 30px;}
    .list-wrap .list .list-item .item-info .prc{color: #f44;}
    .btn-list{padding: 10px 85px;background: #ebebeb;}
    .btn-list .item{width: 60px;height: 60px;margin: 0 auto;line-height: 70px;border-radius: 6px;color: #666;font-size: 40px;background: #fff;}
    .btn-list .text{line-height: 20px;color: #666}
</style>