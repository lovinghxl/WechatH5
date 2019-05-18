<template>
    <div class="wrap">
        <van-row class="article-info">
            <van-col class="article-title text-center" span="24">
                {{resultInfo.title}}
            </van-col>
            <van-col span="24">
                <div class="article-centent" v-html="resultInfo.content"></div>
            </van-col>
        </van-row>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'vArticleDetails',
    data () {
        return {
            searchVal: '',
            active: 0,//tabs选中下标
            resultInfo: { //请求回来的数据
                add_time: '',
                author: '',
                commit_count: '',
                content: '',
                id: '',
                name: '',
                status: '',
                summary: '',
                title: '',
                type_id: '',
                update_time: '',
                user_id: '',
                view_count: '',
            }
        }
    },
    components: {
        
    },
    created: function () {
        // 获取跳转页面带过来的参数
        let params = {id: this.$route.query.id}
        API.getArticleDetalilsInfo(params).then((data) => {
            if (data.data.errno === 0) {
                this.resultInfo = data.data.data
            }
        })
    },
    mounted: function () {

    },
    methods: {
        
    }
}
</script>

<style scoped>
    .wrap{height: 100%;}
    .article-info{}
    .article-info .article-title{line-height: 40px;font-size: 18px;}
    .article-info .article-centent{padding: 0 10px;line-height: 16px;text-align: center;font-size: 14px;color: #616161;}
    .article-info .article-centent img{width: 100%}
    .article-info .article-centent p{width: 100%}
</style>


