<template>
    <div class="wrap">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-row class="item" v-for="item in resultInfo.data" :key="item.id">
                <van-button type="default" size="small" class="more" v-if="item.status == 1" @click="handelSeeReplye(item)">查看回复</van-button>
                <van-col span="24" class="title">
                    投诉类型: {{item.type_id}}
                </van-col>
                <van-col span="24" class="content">
                    <span>投诉内容:</span>  {{item.content}}
                </van-col>
                <van-col span="24" class="time">
                    投诉时间：{{item.add_time}} 
                    <span class="state" v-if="item.status == 0">
                        <van-tag plain type="danger">未处理</van-tag>
                    </span>
                    <span class="state" v-if="item.status == 1">
                        <van-tag plain type="success">已处理</van-tag>
                    </span>
                </van-col>
            </van-row>
        </van-list>
        <van-popup v-model="replyShow" position="bottom" class="overlay">
            <div>
                <div class="complaint-text">
                    您投诉的内容：{{replyMore.content}}
                </div>
                <div class="reply-text">
                    给您的回复：{{replyMore.reply_msg}}
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'complaintList',
    data () {
        return {
            //下拉更新数据
            loading: false,
            finished: true,
            resultInfo: {
                currentNum: '',
                currentPage: '',
                data: [],
                numsPerPage: '',
                totalCount: '',
                totalPages: '',
            },
            params: {
                page: 1
            },
            replyShow: false,
            replyMore: {}
        }
    },
    components: {
        
    },
    computed: {
        
    },
    created: function () {
        this.getInfo(1)
    },
    mounted: function () {
        
    },
    methods: {
        getInfo (type) {
            API.getTousuQuery(this.params).then((data) => {
                const _res = data.data
                if (type == 1) {
                    this.resultInfo = _res
                    this.finished = false
                } else {
                    if (_res.data.length != 0) {
                        this.resultInfo.data = this.resultInfo.data.concat(_res.data)
                    }
                    this.loading = false
                    console.log(_res.totalPages)
                    if (this.params.page >= _res.totalPages) {
                        this.finished = true
                    }
                }
            })
        },
        handelSeeReplye (item) { //查看回复
            this.replyMore = item
            this.replyShow = !this.replyShow
        },
        onLoad() {
            // 异步更新数据
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
    .item{position: relative;padding: 0 10px;border: .5px solid #ededed;background: #fff}
    .item .more{position: absolute;right: 1px;}
    .item .title{line-height: 30px;font-size: 16px;}
    .item .content{line-height: 20px;font-size: 14px;color: #666;text-align: justify;text-overflow: -o-ellipsis-lastline;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 3;line-clamp: 3;-webkit-box-orient: vertical;}
    .item .content span{color: #040404;}
    .item .time{font-size: 12px;line-height: 30px;color: #9f9a9a}
    .item .state{margin-left: 10px;}
    .overlay{height: 80vh;padding: 15px 10px 0 10px;overflow-x: scroll}
    .overlay .complaint-text{line-height: 24px;}
    .overlay .reply-text{line-height: 24px;}
</style>