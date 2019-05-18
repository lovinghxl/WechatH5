<template>
    <div class="wrap">
        <div class="fixed">
            <!-- 搜索 -->
            <van-search
                v-model="params.keyword"
                placeholder="请输入搜索关键词"
                show-action
                @search="handelSearch"
            >
                <div slot="action" @click="handelSearch">搜索</div>
            </van-search>
            <!-- 分类 -->
            <van-tabs v-model="active" color="#28a9ff" @click="handelGetType">
                <van-tab :title="item.name" v-for="item in resultInfo.articleType" :key="item.id"></van-tab>
            </van-tabs>
        </div>
        <!-- 文章列表 -->
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-row class="articel-list">
                <van-col v-for="(item, index) in resultInfo.articleList.data" :key="index" span="24" class="articel-list-item">
                    <router-link :to="{path:'/articleDetails', query:{id: item.id}}">
                        <h4 class="title" v-html="item.title"></h4>
                        <p class="describe">{{item.summary}}</p>
                        <van-row class="text-center article-info" type="flex">
                            <van-col>
                                <van-icon name="clock-o" />{{item.add_time}}
                            </van-col>
                            <van-col>
                                <van-icon name="manager-o" />{{item.author}}
                            </van-col>
                            <van-col>
                                <van-icon name="eye-o" />{{item.view_count}}
                            </van-col>
                            <van-col>
                                <van-icon name="apps-o" />{{item.name}}
                            </van-col>
                        </van-row>
                    </router-link>
                </van-col>
            </van-row>
        </van-list>
        <van-popup overlay-class="index" v-model="moreArticleTypeShow" position="right" @click-overlay="handelOverlay">
            <van-button type="default" size="small" @click="moreArticleTypeGetInfo(item.id)" v-for="item in resultInfo.moreAricleType" :key="item.id">{{item.name}}</van-button>
        </van-popup>
        <!--导航-->
        <v-nav></v-nav>
    </div>
</template>

<script>
import API from '@/api/index'
import vNav from '@/components/nav'
export default {
    name: 'vArticle',
    data () {
        return {
            active: 0,
            resultInfo: {
                articleList: {
                    data: []
                },//文章列表
                articleType: [],//四条文章分类数据
                moreAricleType: [],//文章分类数据
            },
            loading: false,
            finished: false,
            offset: 50, //距离底部加载
            moreArticleTypeShow: false, //更多弹出窗
            params: {
                page: 1, //请求页
                type_id: null,//请求分类id
                keyword: null //搜索词
            }
        }
    },
    components: {
        vNav
    },
    created: function () {
        this.getArticleList(1)
        API.getArticleTypeInfo().then(({ data }) => { //获取文章类型
            this.resultInfo.moreAricleType = data.articleType
        })
        API.getArticleTypeInfo().then(({ data }) => { //获取文章类型
            this.resultInfo.articleType = data.articleType.splice(0,4)
            this.resultInfo.articleType.splice(0,0,{id: '',name: '全部'})
            this.resultInfo.articleType.push({id: 'more',name: '更多'})
        })
    },
    mounted: function () {
        
    },
    methods: {
        getArticleList (type) { //获取文章列表
            API.getArticleListInfo(this.params).then(({ data }) => {
                if (type === 1) {
                    this.resultInfo.articleList = data
                    this.resultInfo.articleList.data.map(item => {
                        item.add_time = item.add_time.slice(0, 10)
                    })
                    if (data.totalPage == 1) {
                        this.loading = false
                        this.finished = true
                    }
                } else {//concat
                    if (data.data.length != 0) {
                        this.resultInfo.articleList.data = this.resultInfo.articleList.data.concat(data.data);
                        this.resultInfo.articleList.data.map(item => {
                            item.add_time = item.add_time.slice(0, 10)
                        })
                        this.loading = false
                        if (this.params.page >= data.totalPage) {
                            this.finished = true
                        }
                    }
                }
            })
        },
        handelSearch () { //搜索
            this.params.page = 1
            this.getArticleList(1)
        },
        handelGetType ($index, title) { //点击分类
            if (this.resultInfo.articleType.length == $index+1) {
                this.moreArticleTypeShow = true
            } else {
                if (this.params.type_id == this.resultInfo.articleType[$index].id) {
                    return
                } else {
                    this.params.page = 1
                    this.resultInfo.articleList = {}
                    this.params.type_id = this.resultInfo.articleType[$index].id
                    this.finished = false
                    this.getArticleList(1)
                }
            }
        },
        handelOverlay () { //点击蒙层
            // if (this.params.type_id != null) {
            //     for (let i=0;i<this.resultInfo.articleType.length;i++) {
            //         console.log(this.resultInfo.articleType[i].type_id)
            //         console.log(this.params.type_id)
            //         if (this.resultInfo.articleType[i].type_id == this.params.type_id) {
            //             this.active = i
            //         }
            //     }
            // } else if (this.params.type_id == null) {
            //     this.active = 0
            // }
        },
        moreArticleTypeGetInfo (id) { //点击类型按钮获取数据
            this.params.page = 1
            this.resultInfo.articleList = {}
            this.params.type_id = id
            this.finished = false
            this.getArticleList(1)
            this.moreArticleTypeShow = false
        },
        onLoad() {// 上拉加载更多数据
            setTimeout(() => {
                this.params.page++
                this.getArticleList(2)
            }, 500);
        }
    }
}
</script>

<style scoped>
    .wrap{padding-bottom: 48px;}
    .fixed{position: fixed;top: 0;left: 0;width: 100%;z-index: 2;}
    .articel-list{margin-top: 85px;}
    .articel-list .articel-list-item{padding: 10px;border-bottom: 1px solid #ededed;}
    /* .articel-list .articel-list-item:first-child{margin-bottom: 40px;} */
    .articel-list .articel-list-item .title{margin-bottom: 8px;font-size: 15px;color: #444;}
    .articel-list .articel-list-item .describe{height: 40px;margin-bottom: 5px;line-height: 20px;height: 61px;overflow: hidden;font-size: 14px;color: #8b8b8b;}
    .articel-list .articel-list-item .article-info{font-size: 14px;color: #888;}
    .articel-list .articel-list-item .article-info .van-col{margin-right: 5px;}
    .articel-list .articel-list-item .article-info .van-icon{top: 2px;left: 1px;color: rgb(40, 169, 255);}
    /* 更多弹出 */
    .van-popup{width: 90%;padding: 10px;height: 100%;background: #fff;}
    .van-popup .van-button{margin-right: 5px; margin-bottom: 5px;}
</style>

