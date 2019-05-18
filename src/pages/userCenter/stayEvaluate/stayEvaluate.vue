<template>
    <div class="wrap">
        <!-- 商品列表 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            v-if="!goodsListLength"
        >
            <van-card
                :num="item.number"
                :desc="item.goods_specifition_name_value"
                :price="item.retail_price"
                :title="item.goods_name"
                :thumb="item.primary_pic_url"
                :origin-price="item.retail_price"
                v-for="item in resultInfo.list"
                :key="item.id"
            >
                <div slot="footer">
                    <van-button @click="handelEvaluateShow(item.order_id, item.goods_id)" size="mini">评价</van-button>
                </div>
            </van-card>
        </van-list>
        <van-popup v-model="complaintShow" position="right" class="overlay100vh">
            <div class="return-wrap">
                <div class="return text-center" @click="handelEvaluateShow">
                    <van-icon name="arrow-left" />
                </div>
            </div>
            <van-row class="textarea">
                <van-field type="textarea" :error-message="errMes" :autosize="{ maxHeight: 200, minHeight: 50 }" v-model="params.content" placeholder="评论内容" />
            </van-row>
            <van-row>
                <van-col class="img" v-show="params.imagesList">
                    <img :src="'http://www.hyw666.club/' + params.imagesList" :alt="params.imagesList">
                </van-col>
                <van-uploader accept="image/png,image/jpeg,image/jpg" :after-read="onRead">
                    <van-icon name="photograph" />
                </van-uploader>
            </van-row>
            <div class="fixed">
                <van-button size="large" :loading="loading" @click="handelSubmitEvaluate" type="primary">提交评论</van-button>
            </div>
        </van-popup>
        <div class="tips" v-if="goodsListLength">
            <van-icon name="orders-o" />
            <div class="tips-text">
                您还没有待评价的商品
            </div>
        </div>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'stayEvaluate',
    data () {
        return {
            complaintShow: false,
             //请求回来的数据
            resultInfo: {
                currentNum: '',
                currentPage: '',
                list: [],
                numsPerPage: '',
                total: '',
                totalPage: '',
            },
            params: {
                typeId: 0,
                valueId: '', //商品的ID
                content: '', //	评论内容(已经被加密)
                imagesList: '', //	否	string	该评论下的图片
                id: '', //订单商品表ID(不是商品ID)
            },
            page: 1,
            //上拉加载更多
            loading: false,
            finished: true,
            errMes: ''
        }
    },
    components: {
        
    },
    computed: {
        goodsListLength: function () {
            return this.resultInfo.list.length == 0
        },
    },
    created: function () {
        this.getInfo(1)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo (type) {
            API.getOrderCommitGood({page: this.page}).then((data) => {
                const _res = data.data
                if (type == 1) {
                    if (_res.list) {
                        this.resultInfo = _res
                        this.finished = false
                    }
                } else {
                    if (_res.list.length != 0) {
                        this.resultInfo.list = this.resultInfo.list.concat(_res.list)
                    }
                    this.loading = false
                    if (this.page >= _res.totalPage) {
                        this.finished = true
                    }
                }
            })
        },
        handelEvaluateShow (orderId, goodsId) {
            if (orderId) {
                this.params.valueId = goodsId
                this.params.id = goodsId
            }
            this.complaintShow = !this.complaintShow
        },
        onRead(file) { //上传图片
            let param = new FormData(); //创建form对象
            param.append('file',file.file);
            API.postUploadComment(param).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.params.imagesList = _res.data
                }
            })
        },
        handelSubmitEvaluate () { //提交 
            if (this.params.content == '') {
                this.errMes = '评论内容不能为空'
                return
            }
            API.getCommentPost(this.params).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.$toast.success(_res.errmsg);
                } else {
                    this.$toast.fail(_res.errmsg);
                }
            })
        },                  
        onLoad() {// 上拉加载更多数据
            setTimeout(() => {
                this.page++
                this.getInfo(2)
            }, 500);
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;}
    .overlay100vh{bottom: 0;width: 100%;height: 100vh;background: #f4f4f4}
    .return-wrap{padding: 5px 10px;background: #fff;}
    .return{display: inline-block;width: 35px;height: 35px;line-height: 41px;border-radius: 50%;font-size: 25px;background: rgba(40, 169, 255, .5);color: #fff;}
    .textarea{border: .5px solid #ccc;}
    .van-uploader{width: 70px;height: 70px;}
    .van-uploader i{font-size: 70px;color: #444}
    .img{width: 70px;height: 70px;padding: 0 5px;}
    .fixed{position: fixed;left: 0;bottom: 0;width: 100%;}
</style>