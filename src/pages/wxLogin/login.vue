<template>
    <div class="wrap">
        <div class="loading" v-if="count">
          <van-loading class="variable" type="spinner" color="#fff" />
          登录中...
        </div>
    </div>
</template>

<script>
export default {
    name: 'login',
    data () {
        return {
            
        }
    },
    components: {
        
    },
    created: function () {
        
    },
    mounted: function () {
        let loginMid = $cookies.get('loginMid')
        $cookies.remove('loginMid')
        //测试
        if (loginMid) {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx431c551f0d8e0a28&redirect_uri=http%3a%2f%2fghy.hyw666.club%2ftfapi%2fauth%2flogin_by_weixin&response_type=code&scope=snsapi_userinfo&state=' + loginMid
        } else {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx431c551f0d8e0a28&redirect_uri=http%3a%2f%2fghy.hyw666.club%2ftfapi%2fauth%2flogin_by_weixin&response_type=code&scope=snsapi_userinfo&state=index'
        }
        // 正式
        // if (loginMid) {
        //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx431c551f0d8e0a28&redirect_uri=http%3a%2f%2fwww.hyw666.club%2ftfapi%2fauth%2flogin_by_weixin&response_type=code&scope=snsapi_userinfo&state=' + loginMid
        // } else {
        //     window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx431c551f0d8e0a28&redirect_uri=http%3a%2f%2fwww.hyw666.club%2ftfapi%2fauth%2flogin_by_weixin&response_type=code&scope=snsapi_userinfo&state=index'
        // }
    },
    methods: {
        
    }
};
</script>
