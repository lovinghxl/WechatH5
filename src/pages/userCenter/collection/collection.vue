<template>
    <div class="wrap">
        <van-row class="text-right header">
          <van-button @click="handelShow" type="default" size="small">{{btnText}}</van-button>
        </van-row>
        <div v-if="goodsShow">
            <!-- 商品列表展示 -->
            <van-list
                v-model="loading"
                :finished="finished"
                finished-text="没有更多了"
                @load="onLoad"
            >
                <router-link tag="div" v-for="(item, index) in resultInfo.data" :key="index" :to="{path: '/goodsDetails', query: {id: item.value_id}}">
                    <van-card
                        :title="item.name"
                        :desc="item.add_time"
                        :num="item.number"
                        :price="item.retail_price"
                        :thumb="item.primary_pic_url"
                    >
                    </van-card>
                </router-link>
            </van-list>
        </div>
        <div v-if="!goodsShow" class="manage">
            <van-checkbox-group v-model="result">
                <van-checkbox
                    v-for="(item, index) in resultInfo.data"
                    :key="item.id"
                    :name="item.id"
                    class="card-goods-item"
                >
                    <van-card
                        :title="item.name"
                        :desc="item.add_time"
                        :num="item.number"
                        :price="item.retail_price"
                        :thumb="item.primary_pic_url"
                    >
                    </van-card>
                </van-checkbox>
            </van-checkbox-group>
        </div>
        <!-- 删除 -->
        <van-submit-bar
            v-if="!goodsShow"
            button-text="删除"
            @submit="handelDelete"
            :disabled="checkedCount == 0"
        >
        <span @click="toggleCheckAll">
            <van-checkbox v-model="allCheck" class="checked-all">全选</van-checkbox>
        </span>
        </van-submit-bar>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'collection',
    data () {
        return {
            resultInfo: {
                currentPage: '',
                currentPageNum: '',
                data: [],
                numsPerPage: '',
                total: '',
                totalNum: '',
            },
            params: {
                page: 1
            },
            loading: false,
            finished: false,
            //选中
            result: [],
            btnText: '管理',
            goodsShow: true
        }
    },
    components: {
        
    },
    computed: {
        allCheck: function () {
            return this.resultInfo.data.length == this.checkedCount
        },
        checkedCount: function () {
            return this.result.length
        }
    },
    created: function () {
        this.getInfo(1)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo (type) {
            API.getCollectList(this.params).then((data) => {
                const _res = data.data
                if (type == 1) {
                    this.resultInfo = _res
                } else {
                    if (_res.data.length != 0){
                        this.resultInfo.data = this.resultInfo.data.concat(_res.data)
                    }
                    this.loading = false
                    if (this.params.page >= _res.totalNum) {
                        this.finished = true
                    }
                }
            })
        },
        handeChecked (id) {
            let idIndex = this.ids.indexOf(id)
            if (idIndex >= 0) {
                this.ids.splice(idIndex, 1)
            } else {
                this.ids.push(id)
            }
        },
        toggleCheckAll () { //全选
            let flag = !this.allCheck
            if (flag) {
                this.resultInfo.data.map(item => {
                    this.result.push(item.id)
                })
            } else {
                this.result = []
            }
        },
        handelDelete () {
            let ids = ''
            this.result.map(item => {
                ids += item + ','
            })
            API.getCollectDeleteBatch({ids: ids}).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.$toast.success('删除成功')
                    this.getInfo(1)
                } else {
                    this.$toast.fail('删除失败')
                }
            })
        },
        handelShow () {
            this.goodsShow = !this.goodsShow
            this.btnText = this.goodsShow ? '管理' : '完成'
            if (this.btnText == '完成') {
                this.result = []
            }
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
    .header{position: fixed;z-index: 1;top: 5px;right: 5px;}
    .van-checkbox__label{width: 93%}
    .van-checkbox__label{margin-left: 0;}
    .card-goods-item{width: 100%;margin-top: 10px;padding: 0 10px;background: #fafafa;}
    .card-goods-item:first-child{margin-top: 0;}
    .checked-all .van-checkbox__label{display: inline-block;width: auto;margin-left: 5px;}
    .manage{padding-bottom: 100px;}
</style>