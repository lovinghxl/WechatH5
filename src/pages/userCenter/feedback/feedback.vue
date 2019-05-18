<template>
    <div class="wrap">
        <van-popup v-model="feedbackTypeShow" class="feedback-wrap">
            <van-row type="flex" justify="space-between" class="feedback text-center">
                <van-col span="7" class="feedback-item">
                    <van-row>
                        <van-icon name="close" />
                    </van-row>
                    <van-row>
                        <span class="text">类型</span>
                    </van-row>
                </van-col>
                <van-col span="7" class="feedback-item">
                    <van-row>
                        <van-icon name="close" />
                    </van-row>
                    <van-row>
                        <span class="text">类型</span>
                    </van-row>
                </van-col>
                <van-col span="7" class="feedback-item">
                    <van-row>
                        <van-icon name="close" />
                    </van-row>
                    <van-row>
                        <span class="text">类型</span>
                    </van-row>
                </van-col>
            </van-row>
        </van-popup>
        <van-field
            v-model="feedFrom.mobile"
            type="number"
            label="手机号"
            required
            placeholder="请输入手机号"
            :error-message="mobileErrMes"
            @focus="handelFocused(1)"
        />
        <van-field
            v-model="feedFrom.content"
            type="textarea"
            required
            :autosize="{ maxHeight: 300, minHeight: 100 }"
            label="反馈内容"
            placeholder="请输入反馈内容"
            :error-message="contentErrMes"
            @focus="handelFocused(2)"
        />
        <div class="fixed">
            <van-button size="large" :loading="loading" @click="handelSubmitFeed" type="primary">提交反馈</van-button>
        </div>
    </div>
</template>

<script>
import API from '@/api/index'
export default {
    name: 'feedback',
    data () {
        return {
            feedbackTypeShow: false,
            feedFrom: {
                feedType: '1',
                mobile: '',
                content: '',
            },
            mobileErrMes: '',
            contentErrMes: '',
            loading: false,
        }
    },
    components: {
        
    },
    created: function () {

    },
    mounted: function () {
        
    },
    methods: {
        handelFocused (type) {
            if (type == 1) {
                this.mobileErrMes = ''
            } else {
                this.contentErrMes = ''
            }
        },
        handelSubmitFeed () { //提交反馈
            if (this.feedFrom.mobile == ''){
                this.mobileErrMes = '手机号码不能为空'
                return
            }
            if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(this.feedFrom.mobile))) {
                this.mobileErrMes = '手机号码格式有误'
                return
            }
            if (this.feedFrom.content == '') {
                this.contentErrMes = '反馈内容不能为空'
                return
            }
            if (this.feedFrom.content.length < 20) {
                this.contentErrMes = '反馈内容字数不能小于20'
                return
            }
            this.loading = true
            API.getFeedbackSave(this.feedFrom).then((data) => {
                const _res = data.data
                if (_res.errno == 0) {
                    this.loading = false
                    this.$toast.success(_res.data)
                }
            })
        }
    }
}
</script>
<style scoped>
    .wrap{height: 100%;background: #f4f4f4;overflow-x: scroll;}
    .feedback-wrap{height: 100vh;width: 100%;background: #f4f4f4;}
    /* .feedback-wrap .feedback{} */
    .feedback-wrap .feedback .feedback-item{padding: 5px 0;background: #fff;}
    .feedback-item i{font-size: 40px;color: #666;}
    .feedback-item .text{line-height: 20px;}
    .fixed{position: fixed;left: 0;bottom: 0;width: 100%;}
</style>