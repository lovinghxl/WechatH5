<template>
    <div class="wrap">
        <div class="loading" v-if="count">
          <van-loading class="variable" type="spinner" color="#fff" />
          登录中...
        </div>
    </div>
</template>

<script>
import axios from 'axios'
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
        let code = decodeURIComponent((new RegExp('[?|&]'+'code'+'='+'([^&;]+?)(&|#|;|$)').exec(location.href)||[,""])[1].replace(/\+/g,'%20'))||null;
        code = code ? code : ''
        if (code != '') {
            code = code.split('&')[0]
            axios({
                method: 'get', // post && get 
                url: 'http://ghy.hyw666.club/platform-plus/app/loginByCode',
                params: {code: code}
            })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
        } else {
            window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx431c551f0d8e0a28&redirect_uri=http%3a%2f%2fghy.hyw666.club%2fplatform-plus%2fapp%2floginByCode&response_type=code&scope=snsapi_base&state=STATE'
        }
    },
    methods: {
        
    }
};
</script>
